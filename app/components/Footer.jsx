import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import {FooterNewsletter} from '~/components/FooterNewsletter';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain, siteSettings}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
  {(footer) => {
    
    // Extract newsletter enabled setting from metaobject
    const enabledField = siteSettings?.metaobject?.fields?.find(
      field => field.key === 'newsletter_enabled'
    );
    
    // Handle both string and boolean values
    const newsletterEnabled = enabledField?.value === 'true' || enabledField?.value === true;

    // Extract other newsletter settings if you added them
    const newsletterTitle = siteSettings?.metaobject?.fields?.find(
      field => field.key === 'newsletter_title'
    )?.value || 'Stay in the loop';

    const newsletterDescription = siteSettings?.metaobject?.fields?.find(
      field => field.key === 'newsletter_description'
    )?.value || 'Be the first to hear about new products, founder updates, and everything atoms.';

    return (
      <footer className="footer">
        <div className="footer-content">
          {footer?.menu && header.shop.primaryDomain?.url && (
            <FooterMenu
              menu={footer.menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          )}
          
          {/* Newsletter section - only show if enabled */}
          {newsletterEnabled && (
            <FooterNewsletter 
              title={newsletterTitle}
              description={newsletterDescription}
            />
          )}
        </div>
      </footer>
    );
  }}
</Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        const renderMenuItem = (menuItem) => {
          if (!menuItem.url) return null;
          const url =
            menuItem.url.includes('myshopify.com') ||
            menuItem.url.includes(publicStoreDomain) ||
            menuItem.url.includes(primaryDomainUrl)
              ? new URL(menuItem.url).pathname
              : menuItem.url;
          const isExternal = !url.startsWith('/');

          const link = isExternal ? (
            <a
              href={url}
              key={menuItem.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {menuItem.title}
            </a>
          ) : (
            <NavLink
              end
              key={menuItem.id}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {menuItem.title}
            </NavLink>
          );

          // Render nested items (submenus)
          if (menuItem.items && menuItem.items.length > 0) {
            return (
              <div key={menuItem.id} className="footer-menu-group">
                {link}
                <ul className="footer-submenu">
                  {menuItem.items.map((subItem) => (
                    <li key={subItem.id}>{renderMenuItem(subItem)}</li>
                  ))}
                </ul>
              </div>
            );
          }

          return link;
        };

        return renderMenuItem(item);
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 * @property {Object} siteSettings
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */

//hello