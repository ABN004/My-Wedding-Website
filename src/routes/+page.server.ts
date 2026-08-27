import { db } from '$lib/server/db';
import { wishes } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	try {
		// Fetch wishes from the database
		const dbWishes = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
		
		// Map DB wishes to match the component's expected format if needed
		// For now, we'll keep the original data format, but ensure it integrates well
		const formattedDbWishes = dbWishes.map(w => ({
			id: w.id,
			name: w.name,
			relation: w.relation,
			message: w.message,
			image: w.imageUrl
		}));

		return {
			wishes: formattedDbWishes
		};
	} catch (error) {
		console.error('Error loading wishes from DB:', error);
		// Return empty array if DB is not configured or reachable
		return {
			wishes: []
		};
	}
}
