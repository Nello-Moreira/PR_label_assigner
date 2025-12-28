import { Octokit } from '@octokit/rest';

const owner = process.env.OWNER;
const repo = process.env.REPOSITORY;
const authToken = process.env.GITHUB_AUTH_TOKEN;
const brachLabelMap = {
	main: 'feature',
	staging: 'bug-fix',
	production: 'hot-fix',
};

if (!authToken) {
	console.log('GITHUB_AUTH_TOKEN not set. Please follow these steps:');
	console.log('- Go to https://github.com/settings/tokens/new');
	console.log('- Generate a personal token with repo access');
	console.log('- Set it in .env as GITHUB_AUTH_TOKEN');
	process.exit(1);
}
const octokit = new Octokit({ auth: authToken });

assignLabels();

function log(msg) {
	console.log(`\n\n${Array(80).join('#')}\n`);
	console.log(`==> ${msg}`);
	console.log(`\n${Array(80).join('#')}\n\n`);
}

async function assignLabels() {
	console.log('Finding open PRs...\n');
	const { data: pullRequests } = await octokit.rest.pulls.list({ owner, repo });
	console.log(
		`Found ${pullRequests.length} PRs: ${pullRequests
			.map(pr => `#${pr.number}`)
			.join(',')}`
	);
	await Promise.all(
		pullRequests.map(async pr => {
			const pull_number = pr.number;
			const { data: currentLabels } =
				await octokit.rest.issues.listLabelsOnIssue({
					owner,
					repo,
					issue_number: pull_number,
				});
			if (!Object.keys(brachLabelMap).includes(pr.base.ref)) {
				log(
					`#${pull_number} has a unknown branch name: ${pr.base.ref}, skipping...`
				);
				return;
			}
			const currentLabelsNames = currentLabels.map(l => l.name).sort();
			const targetLabel = brachLabelMap[pr.base.ref];
			const newLabels = currentLabelsNames
				.filter(label => !Object.values(brachLabelMap).includes(label))
				.concat(targetLabel)
				.filter(Boolean)
				.sort();
			if (
				newLabels
					.map((newlabel, i) => newlabel === currentLabelsNames[i])
					.every(Boolean)
			) {
				log(`#${pull_number} already has ${currentLabelsNames.join(', ')}`);
				return;
			}
			log(`Assigning label ${pr.base.ref} to #${pull_number}`);
			await octokit.rest.issues.addLabels({
				owner,
				repo,
				issue_number: pull_number,
				labels: newLabels,
			});
		})
	);
}
