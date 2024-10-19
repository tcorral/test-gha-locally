# test-gha-locally

With `colima` and `act` to work in Macbook with Silicon chips: 
- To run the whole pipeline:
    - Execute `DOCKER_HOST=unix://$HOME/.colima/docker.sock act --container-architecture linux/amd64`
    - All workflows should have a different name for the whole pipeline to work.
- To run a specific workflow use push -W '.github/workflows/test.yml'
    - Execute `DOCKER_HOST=unix://$HOME/.colima/docker.sock act --container-architecture linux/amd64 push -W 'path/to/workflow.yml`

## Events triggering workflows

| Event workflow  | Activity types | `GITHUB_SHA` | `GITHUB_REF` |
| ---------------------- | -------------- | ------------ |------------- |
| `branch_protection_rule` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `check_run` | <ul><li>`created`</li><li>`rerequested`</li><li>`completed`</li><li>`requested_action`</li></ul> | Last commit on default branch | Default branch |
| `check_suite` | <ul><li>`completed`</li></ul> | Last commit on default branch | Default branch |
| `create` | N/A | Last commit on the created branch or tag | Branch or tag created |
| `delete` | N/A | Last commit on default branch | Default branch |
| `deployment` | N/A | Commit to be deployed | Branch or tag to be deployed (empty if created with a commit SHA) |
| `deployment_status` | N/A | Commit to be deployed | Branch or tag to be deployed (empty if commit) |
| `discussion` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li><li>`transferred`</li><li>`pinned`</li><li>`unpinned`</li><li>`labeled`</li><li>`unlabeled`</li><li>`locked`</li><li>`unlocked`</li><li>`category_changed`</li><li>`answered`</li><li>`unanswered`</li></ul> | Last commit on default branch | Default branch |
| `discussion_comment` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `fork` | N/A | Last commit on default branch | Default branch |
| `gollum` | N/A | Last commit on default branch | Default branch |
| `issue_comment` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `issues` | <ul><li>`opened`</li><li>`edited`</li><li>`deleted`</li><li>`transferred`</li><li>`pinned`</li><li>`unpinned`</li><li>`closed`</li><li>`reopened`</li><li>`assigned`</li><li>`unassigned`</li><li>`labeled`</li><li>`unlabeled`</li><li>`locked`</li><li>`unlocked`</li><li>`milestoned`</li><li>`demilestoned`</li></ul> | Last commit on default branch | Default branch |
| `label` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `merge_group` | <ul><li>`checks_requested`</li></ul> | SHA of the merge group | Ref of the merge group |
| `milestone` | <ul><li>`created`</li><li>`closed`</li><li>`opened`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `page_build` | N/A | Last commit on default branch | Default branch |
| `public` | N/A | | Last commit on default branch | Default branch |
| `pull_request` | <ul><li>`assigned`</li><li>`unassigned`</li><li>`labeled`</li><li>`unlabeled`</li><li>`opened`</li><li>`edited`</li><li>`closed`</li><li>`reopened`</li><li>`synchronize`</li><li>`converted_to_draft`</li><li>`locked`</li><li>`unlocked`</li><li>`enqueued`</li><li>`dequeued`</li><li>`milestoned`</li><li>`demilestoned`</li><li>`ready_for_review`</li><li>`review_requested`</li><li>`review_request_removed`</li><li>`auto_merge_enabled`</li><li>`auto_merge_disabled`</li></ul> | Last merge commit on the GITHUB_REF branch | PR merge branch refs/pull/PULL_REQUEST_NUMBER/merge |
| `pull_request_comment` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last commit on default branch | Default branch |
| `pull_request_review` | <ul><li>`submitted`</li><li>`edited`</li><li>`dismissed`</li></ul> | Last merge commit on the GITHUB_REF branch | PR merge branch refs/pull/PULL_REQUEST_NUMBER/merge |
| `pull_request_review_comment` | <ul><li>`created`</li><li>`edited`</li><li>`deleted`</li></ul> | Last merge commit on the GITHUB_REF branch | PR merge branch refs/pull/PULL_REQUEST_NUMBER/merge |
| `pull_request_target` | <ul><li>`assigned`</li><li>`unassigned`</li><li>`labeled`</li><li>`unlabeled`</li><li>`opened`</li><li>`edited`</li><li>`closed`</li><li>`reopened`</li><li>`synchronize`</li><li>`converted_to_draft`</li><li>`ready_for_review`</li><li>`locked`</li><li>`unlocked`</li><li>`review_requested`</li><li>`review_request_removed`</li><li>`auto_merge_enabled`</li><li>`auto_merge_disabled`</li></ul> | Last commit on the PR base branch | PR base branch |
| `push` | N/A | Tip commit pushed to the ref. When you delete a branch, the SHA in the workflow run (and its associated refs) reverts to the default branch of the repository. | Updated ref |
| `registry_package` | <ul><li>`published`</li><li>`updated`</li></ul> | Commit of the published package | Branch or tag of the published package |
| `release` | <ul><li>`published`</li><li>`unpublished`</li><li>`created`</li><li>`edited`</li><li>`deleted`</li><li>`prereleased`</li><li>`released`</li></ul> | Last commit in the tagged release | Tag ref of release refs/tags/<tag_name> |
| `repository_dispatch` | Custom | Last commit on default branch | Default branch |
| `schedule` | N/A | Last commit on default branch | Default branch |
| `status` | N/A | Last commit on default branch | N/A |
| `watch` | <ul><li>`started`</li></ul> | Last commit on default branch | Default branch |
| `workflow_call` | N/A | Same as the caller workflow | Same as the caller workflow |
| `workflow_dispatch` | N/A | Last commit on the GITHUB_REF branch or tag | Branch or tag that received dispatch |
| `workflow_run` | <ul><li>`completed`</li>li>requested`</li>li>in_progress`</li></ul> | Last commit on default branch | Default branch |

[Github workflow events documentation](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request_review_comment)