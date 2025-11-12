// Virtual entry point for the app
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const response = await handleRequest(request);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
      }

      //Add Content Security Policy
      const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com",
        "style-src 'self' 'unsafe-inline'",
        "media-src 'self' https://cdn.shopify.com https://*.myshopify.com",
        "img-src 'self' data: https://cdn.shopify.com https://*.myshopify.com",
        "connect-src 'self' https://monorail-edge.shopifysvc.com https://icecubedev.myshopify.com http://localhost:* ws://localhost:* ws://127.0.0.1:* ws://*.tryhydrogen.dev:* https://cdn.shopify.com",
      ];

      response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
