import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { wishes } from '$lib/server/db/schema';
import ImageKit from 'imagekit';
import { env } from '$env/dynamic/private';
import { desc } from 'drizzle-orm';

// Initialize ImageKit only if environment variables are present
// This prevents crashing on startup when variables are missing, as per user requirement
let imagekit: ImageKit | null = null;
if (env.IMAGEKIT_PUBLIC_KEY && env.IMAGEKIT_PRIVATE_KEY && env.IMAGEKIT_URL_ENDPOINT) {
	imagekit = new ImageKit({
		publicKey: env.IMAGEKIT_PUBLIC_KEY,
		privateKey: env.IMAGEKIT_PRIVATE_KEY,
		urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
	});
}

export async function POST({ request }) {
	try {
		const data = await request.formData();
		const name = data.get('name') as string;
		const relation = data.get('relation') as string;
		const message = data.get('message') as string;
		const image = data.get('image') as File;

		if (!name || !relation || !image) {
			return json({ error: 'Name, relation, and image are required' }, { status: 400 });
		}

		let imageUrl = '';

		// Convert File to Buffer for ImageKit upload
		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		if (imagekit) {
			const uploadResponse = await new Promise<any>((resolve, reject) => {
				imagekit!.upload(
					{
						file: buffer,
						fileName: image.name || 'wish_image.jpg',
						folder: '/wedding_wishes'
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					}
				);
			});
			imageUrl = uploadResponse.url;
		} else {
			// Fallback if imagekit is not configured (for local dev without keys)
			console.warn('ImageKit is not configured. Saving without actual upload.');
			imageUrl = '/images/dummy-wish-1.png'; // Fallback dummy image
		}

		// Save to Neon DB
		const [newWish] = await db
			.insert(wishes)
			.values({
				name,
				relation,
				message,
				imageUrl
			})
			.returning();

		return json({ success: true, wish: newWish });
	} catch (error: any) {
		console.error('Error in wish submission:', error);
		return json({ error: error.message || 'An error occurred' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const allWishes = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
		return json({ wishes: allWishes });
	} catch (error) {
		console.error('Error fetching wishes:', error);
		// If DB fails, just return empty array
		return json({ wishes: [] });
	}
}
