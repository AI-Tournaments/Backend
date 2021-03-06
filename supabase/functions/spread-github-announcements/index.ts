import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsAll as headers } from '../_shared/responseHeaders.ts'

serve(async (req) => {
	if(req.method === 'OPTIONS'){
		return new Response('ok', { headers: headers })
	}

	const { action, discussion } = await req.json()

	const isCreated = action === 'created'
	const isAnnouncement = discussion.category.node_id === 'DIC_kwDOF2FhEs4CQX_F'
	const discordAnnouncementWebhook = Deno.env.get('discord.announcementWebhook')

	if(isCreated && isAnnouncement && discordAnnouncementWebhook){
		fetch(new Request(discordAnnouncementWebhook, {
			method: 'POST',
			headers: new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				content: '['+discussion.title+']('+discussion.html_url+')'
			})
		}))
	}

	return new Response(null, {headers: {...headers}})
})
