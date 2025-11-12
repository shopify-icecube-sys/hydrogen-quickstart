import {data} from '@shopify/remix-oxygen';

/**
 * Helper function to update existing customer marketing consent
 */
async function updateExistingCustomerMarketing(shopDomain, accessToken, email) {
  try {
    // Find customer by email using GraphQL
    const searchQuery = `
      query {
        customers(first: 1, query: "email:${email}") {
          edges {
            node {
              id
              email
            }
          }
        }
      }
    `;

    const searchResponse = await fetch(`https://${shopDomain}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({ query: searchQuery })
    });

    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      const customers = searchResult.data?.customers?.edges;
      
      if (customers && customers.length > 0) {
        const customerId = customers[0].node.id;
        
        // Update customer marketing consent
        const updateQuery = `
          mutation customerUpdate($input: CustomerInput!) {
            customerUpdate(input: $input) {
              customer {
                id
                acceptsMarketing
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const updateInput = {
          id: customerId,
          acceptsMarketing: true,
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN"
          }
        };

        const updateResponse = await fetch(`https://${shopDomain}/admin/api/2024-10/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          },
          body: JSON.stringify({
            query: updateQuery,
            variables: { input: updateInput }
          })
        });

        if (updateResponse.ok) {
          console.log('Existing customer updated for marketing subscription');
          return data({
            success: true,
            message: 'Thanks for subscribing!'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating existing customer:', error);
  }

  return data({
    success: true,
    message: 'Thanks! You\'re now subscribed!'
  });
}

/**
 * Newsletter subscription API route using Admin API
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  try {
    const {email} = await request.json();
    
    if (!email) {
      return data({error: 'Email is required'}, {status: 400});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return data({error: 'Please enter a valid email address'}, {status: 400});
    }

    // Debug environment variables
    console.log('Full context.env keys:', Object.keys(context.env || {}));
    console.log('PUBLIC_STORE_DOMAIN:', context.env?.PUBLIC_STORE_DOMAIN);
    console.log('PRIVATE_ADMIN_API_ACCESS_TOKEN exists:', !!context.env?.PRIVATE_ADMIN_API_ACCESS_TOKEN);

    // Use Admin API to create customer
    const shopDomain = context.env?.PUBLIC_STORE_DOMAIN;
    const accessToken = context.env?.PRIVATE_ADMIN_API_ACCESS_TOKEN;
    
    if (!shopDomain || !accessToken) {
      console.error('Missing environment variables:', {
        shopDomain: shopDomain || 'MISSING',
        accessTokenExists: !!accessToken
      });
      
      // For now, just log the email and return success
      console.log(`Newsletter signup (fallback): ${email}`);
      return data({
        success: true,
        message: 'Thanks for subscribing! (Email logged)'
      });
    }

    // Create customer using Admin API
    const customerData = {
      customer: {
        email: email,
        accepts_marketing: true,
        accepts_marketing_updated_at: new Date().toISOString(),
        marketing_opt_in_level: 'single_opt_in',
        tags: 'newsletter'
      }
    };

    // Create customer using GraphQL Admin API for better marketing consent support
    const graphqlQuery = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const customerInput = {
      email: email,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN"
      },
      tags: ["newsletter"]
    };

    console.log('Making GraphQL request to create customer with marketing consent');

    const graphqlResponse = await fetch(`https://${shopDomain}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { input: customerInput }
      })
    });

    console.log('GraphQL response status:', graphqlResponse.status);

    if (graphqlResponse.ok) {
      const result = await graphqlResponse.json();
      console.log('GraphQL result:', JSON.stringify(result, null, 2));
      
      if (result.data?.customerCreate?.customer) {
        return data({
          success: true,
          message: 'Thanks for subscribing!'
        });
      } else if (result.data?.customerCreate?.userErrors?.length > 0) {
        const errors = result.data.customerCreate.userErrors;
        console.log('Customer creation errors:', errors);
        
        // Check if email already exists
        const emailExistsError = errors.find(err => 
          err.field?.includes('email') && err.message?.includes('taken')
        );
        
        if (emailExistsError) {
          // Customer exists, let's try to update their marketing consent
          return await updateExistingCustomerMarketing(shopDomain, accessToken, email);
        }
        
        return data({
          error: 'Failed to subscribe. Please try again.'
        }, {status: 400});
      }
    }

    // Fallback to REST API if GraphQL fails
    const apiUrl = `https://${shopDomain}/admin/api/2024-10/customers.json`;
    console.log('Fallback to REST API:', apiUrl);

    const adminResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        customer: {
          email: email,
          accepts_marketing: true,
          accepts_marketing_updated_at: new Date().toISOString(),
          marketing_opt_in_level: 'single_opt_in',
          tags: 'newsletter'
        }
      })
    });

    console.log('REST API response status:', adminResponse.status);

    if (adminResponse.ok) {
      const result = await adminResponse.json();
      const customerId = result.customer?.id;
      console.log('REST API customer created:', customerId);
      
      // Now update the customer to set proper marketing consent using GraphQL
      if (customerId) {
        try {
          const updateQuery = `
            mutation customerUpdate($input: CustomerInput!) {
              customerUpdate(input: $input) {
                customer {
                  id
                  emailMarketingConsent {
                    marketingState
                    marketingOptInLevel
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          const updateInput = {
            id: `gid://shopify/Customer/${customerId}`,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN"
            }
          };

          const updateResponse = await fetch(`https://${shopDomain}/admin/api/2024-10/graphql.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken
            },
            body: JSON.stringify({
              query: updateQuery,
              variables: { input: updateInput }
            })
          });

          if (updateResponse.ok) {
            const updateResult = await updateResponse.json();
            console.log('Marketing consent update result:', JSON.stringify(updateResult, null, 2));
          }
        } catch (updateError) {
          console.error('Error updating marketing consent:', updateError);
        }
      }
      
      return data({
        success: true,
        message: 'Thanks for subscribing!'
      });
    } else if (adminResponse.status === 422) {
      // Validation error, likely duplicate email
      const errorData = await adminResponse.json();
      console.log('Full validation error:', JSON.stringify(errorData, null, 2));
      
      if (errorData.errors?.email && Array.isArray(errorData.errors.email) && 
          errorData.errors.email.some(err => err.includes('has already been taken'))) {
        // Customer exists, update their marketing preferences
        return await updateExistingCustomerMarketing(shopDomain, accessToken, email);
      }
      return data({
        error: 'Please enter a valid email address'
      }, {status: 400});
    } else {
      const errorText = await adminResponse.text();
      console.error('REST API error:', adminResponse.status, errorText);
      return data({
        error: 'Failed to subscribe. Please try again.'
      }, {status: 500});
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return data({
      error: 'An unexpected error occurred. Please try again later.'
    }, {status: 500});
  }
}

/**
 * Handle GET requests
 */
export function loader() {
  return data({error: 'Method not allowed'}, {status: 405});
}