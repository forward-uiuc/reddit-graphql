const Promise = require('bluebird')
const snoowrap = require('snoowrap');

function redditAPI(context, resolveName, id, args){

	let authorization = JSON.parse(context.headers.authorization)

	return new Promise((resolve,reject) =>{
		
		let unauthorized =  !authorization || !authorization.accessToken
							|| !authorization.refreshToken;
							
		
		if (unauthorized) {
			reject(new Error('Unauthorized Request'));
		}


		const r = new snoowrap({
				userAgent: 	'social monitoring research',
				accessToken: authorization.accessToken ,
				refreshToken: authorization.refreshToken,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET 
		});

		switch(resolveName){
			case 'search':
				args.limit = args.count;

				/*
				 * For some reason if the args have a subreddit attribute,
				 *  snoowrap isn't limiting the search to that subreddit.
				 *  Below is a workaround, but figuring out why it's happening
				 *  in the first place should happen.
				 *  @REFACTOR @EVENTUALLY  @TODO
				 */
				if(args.subreddit) {
					r.getSubreddit(args.subreddit).search(args).then((listing) => {
						resolve(listing);
					})
					.catch((err) => {
						reject(err)
					})
				} else {
					r.search(args).then((listing) =>  {
						resolve(listing);
					})
					.catch((err) =>{
						reject(err)
					})
				}
			break;
				
			case 'getCompleteReplies':
				r.getSubmission(id).expandReplies({options:{limit:Infinity,depth:Infinity}}).then(data =>  {
						agg_comments = [];
						for (var i = 0, length=data.comments.length; i< length; i++){
							commentTreeFlaten(data.comments[i]);
						}
						resolve(agg_comments);
					}).catch((err) => { console.log(err); resolve([]);});
				break;
				
			case 'searchSubreddits':
				args.limit = 1000;

				r.searchSubreddits(args).then((listing) =>  {
				listing.fetchAll().then((data) =>{
					console.log(data);
						resolve(data);
					})
					.catch((err) =>{
						console.log(err);
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
			
			case 'getNewComments':
				if (args['subredditName'] === 'ALL'){
					args['subredditName'] = '';
				}
				r.getSubreddit(args.subredditName).getNewComments({limit:1000}).then((listing) =>  {
					listing.fetchMore({amount:args['extra'],skipReplies:false,append:true}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;	
				
			case 'searchSubredditNames':
				r.searchSubredditNames(args).then((data) =>{
					resolve(data);
				})
				.catch((err) =>{
					reject(err)
				});
				break;
				
			case 'searchSubredditTopics':
				args['limit'] = 1000;
				r.searchSubredditTopics(args).then((data) =>{
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					});
				break;
				
			case 'getPopularSubreddits':
				r.getPopularSubreddits(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
			
			case 'getNewSubreddits':
				r.getNewSubreddits(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'getGoldSubreddits':
				r.getGoldSubreddits(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'getDefaultSubreddits':
				r.getDefaultSubreddits(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'getHot':
				r.getHot(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
			
			case 'getNew':
				r.getNew(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
			
			case 'getTop':
				r.getTop(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'getControversial':
				r.getControversial(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'getRising':
				r.getRising(args).then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
				
			case 'trophy':
				r.getUser(id).getTrophies().then((data) => {
					resolve(data.trophies);
				})
				.catch((err) =>{
					reject(err)
				});
				break;
			
			case 'overview':
				r.getUser(id).getOverview().then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
			
			case 'submission':
				r.getUser(id).getSubmissions().then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'comment':
				r.getUser(id).getComments().then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'upvote':
				r.getUser(id).getUpvotedContent().then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'downvote':
				r.getUser(id).getDownvotedContent().then((listing) =>  {
					listing.fetchMore({amount:args['extra']}).then((data) => {
						resolve(data);
					})
					.catch((err) =>{
						reject(err)
					})
				})
				.catch((err) =>{
					reject(err);
				});
				break;
				
			case 'expansion':
				agg_comments = [];
				r.getSubmission(id).expandReplies({options:{limit:Infinity,depth:Infinity}}).then(data =>  {
					for (var i = 0, length=data.comments.length; i< length; i++){
						commentTreeFlaten(data.comments[i]);
					}
					resolve(agg_comments);
						
				})
				.catch((err) =>{
					reject(err);
				});
				break;	
				
				
			default:
				reject(resolveName)
		}
	});
}

/*---------------------helper function---------------------------*/
function commentTreeFlaten(o){
		
		currentNode = o;
		if (currentNode !== null && currentNode['replies']!== null){
			var children = currentNode['replies'];
			delete currentNode['replies'];
			agg_comments.push(currentNode);
			
			for (var i=0, length =children.length; i< length; i++){
				commentTreeFlaten(children[i])
			}
		}else if (currentNode !== null && currentNode['replies'] === null){
			var children = currentNode['replies'];
			delete currentNode['replies'];
			agg_comments.push(currentNode);
		}
		
}

function wait(ms){
	var start = Date.now(), now = start;
	while(now - start < ms){
		now = Date.now();
	}
}

module.exports = redditAPI;
