export interface Env {
	NUMIA_API_KEY: string;
}

/**
 * /osmosis-rpc/block -> https://osmosis-rpc.numia.xyz/block
 * /osmosis-lcd/cosmos/base/tendermint/v1beta1/blocks/10704303 -> https://osmosis-lcd.numia.xyz/cosmos/base/tendermint/v1beta1/blocks/10704303
 * /osmosis/height -> https://osmosis.numia.xyz/height
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const apiKey = env[`NUMIA_API_KEY`];
			if (!apiKey) {
				return new Response(
					JSON.stringify({
						error: 'Environment is missing the NUMIA_API_KEY variable.',
					}),
					{ status: 401 }
				);
			}
			const url = new URL(request.url);

			const parts = url.pathname.substring(1).split('/');
			const [subdomain, ...restPath] = parts;

			const nextUrl = new URL(`https://${subdomain}.numia.xyz/${restPath.join('/')}`);
			nextUrl.search = url.search;

			return fetch(nextUrl, {
				method: request.method,
				body: request.body,
				headers: {
					authorization: `Bearer ${apiKey}`,
					...request.headers,
				},
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: 'The middleware was not able to load the data and got an error response from the server.',
				}),
				{ status: 500 }
			);
		}
	},
};
