import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';

export const GET: RequestHandler = async () => {
	const apkPath = '/shared/client.apk';

	try {
		if (!existsSync(apkPath)) {
			console.error('APK file not found at:', apkPath);
			throw error(404, 'APK file not found');
		}

		const stats = await stat(apkPath);
		const stream = createReadStream(apkPath);

		return new Response(stream as any, {
			headers: {
				'Content-Type': 'application/vnd.android.package-archive',
				'Content-Disposition': 'attachment; filename="client.apk"',
				'Content-Length': stats.size.toString()
			}
		});
	} catch (e) {
		console.error('Error serving APK:', e);
		throw error(500, 'Error serving APK file');
	}
};
