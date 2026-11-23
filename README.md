# post-x-promote-make-your-own-bounty-01

Entry for the make.fun bounty "Promote make.fun's make-your-own-bounty post on X":
one post of our own on X that quotes make.fun's make-your-own-bounty post,
https://x.com/makefunai/status/2124915864336236646, with a photo of its own
attached and make.fun / the @makefunai tag and our play code in its text.
Places go by the post's score — replies + reposts + quotes at the deadline —
and the top 50 share $250.

make.fun is a site where people and their AI agents build things, enter them
in paid competitions (bounties) and earn real money when they win. Its post
says anyone can now make a bounty of their own: describe any task, set the
reward and the entry fee, and keep a share of every fee people pay to enter;
agents compete, and the best entries get paid
(https://make.fun/sponsor/new).

## The post (drafted, not posted yet)

The exact text to post is in [POST-DRAFT.txt](POST-DRAFT.txt) (273 / 280
characters under X's counting rules), and the photo to attach is
[post-photo.png](post-photo.png) (1600x1600, made for this post). The post
goes out from the user's own public X account — this environment cannot post
to X — following [POSTING-GUIDE.md](POSTING-GUIDE.md). Once it is up, its
address replaces the placeholder in `POST.json` and the entry is submitted.

The draft opens with a question ("What would you pay an AI agent to
build?"), states the deal in one line, carries the required line
`Make your own bounty on @makefunai: https://make.fun/sponsor/new`, asks
readers to reply with their own bounty idea (replies are what the score
counts, along with reposts and quotes), and ends with the play code
`makefun-ribbon-duck-fern` and the referral link
https://make.fun/r/jc69fpy6.

## What the post must have

- It is a quote of make.fun's post (X's Repost button, then Quote) — not a
  reply, not a plain repost.
- It carries at least one photo of its own, uploaded to the post itself
  (`post-photo.png`, made for this post). The photo in make.fun's quoted post
  does not count as the post's own.
- Its text carries make.fun (a link and written out) and the @makefunai tag,
  plus one of the account's play codes (`makefun-ribbon-duck-fern`).
- It is posted at or after the bounty opens (2026-11-23 18:35 UTC) and
  before the deadline (2026-11-26 18:35 UTC / 2026-11-27 01:35 WIB), from a
  public X account, and stays up and public until the results are out.
- One post per entrant. No bought, botted or self-made engagement: never
  reply to, repost or quote the post from our own accounts.

## The program

`main.ts` (Node 22, standard library only) copies `POST.json` from the
repository root to `/output/POST.json` — that is all it has to do. Nothing
it writes about the post is scored; the house reads the post itself from X
through FxTwitter. No network, no clock, no files outside the repository.

Local run:

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

`out/POST.json` is then byte for byte this directory's `POST.json`.

## Status

- [x] Kit initialised (`makefun anchor c3f1ba5cc1044713c47905190d19697bae76d202 round 34220410`)
- [x] Post text drafted (POST-DRAFT.txt), photo made (post-photo.png)
- [x] `main.ts` written and run locally
- [ ] Post made on X by the user (see POSTING-GUIDE.md)
- [ ] `POST.json` filled with the real post address
- [ ] Entry submitted (parent submits after the post is up)
