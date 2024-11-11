import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import { setError } from '$lib/store/errorMessage';
import fs from 'fs';

export const GET: RequestHandler = async () => {
	try {
		const filecontent = await fs.promises.readFile('/shared/client.apk');

		return new Response(filecontent, {
			headers: {
				'Content-Type': 'application/vnd.android.package-archive',
				'Content-Disposition': `attachment; filename="area.apk"`
			}
		});
	} catch (e) {
		setError('Error serving APK');
		throw error(500, 'Error serving APK file');
	}
};
