---
title: Connecting my Blog with Obsidian
date: 2025-09-24
excerpt: what is this about?
---
# My Blog Configuration

## Lets Go through a Quick Setup
**The tools I am using**:
- Obsidian
Yep -- That's it, the only thing that I am using to push, manage, edit, and publish blog posts is inside my obsidian folder vault.

**Okay its not that simple**. Obviously I need some help to get this working correctly, so here are some tools that enabled me to do this.
- Obsidian
- Obsidian Plugins:
	- Templater
	- Commander
	- Shell Commands
- A bash script
## Connecting
The configuration itself is pretty simple. I first created a new folder within my vault called `Blog Posts`. And if you take a look at my [repo](https://github.com/Baguirre03/2025-portfolio) you'll see `./content/blog/` where the markdown file actually lives.

**As you may already know, Obsidian is just directories and MD files**, so I *knew* there had to be a simple way to get the content that I write within Obsidian into the correct directory and push to Github without too much effort. 

## The Bash Script
The dirty work is done in an actual bash script
```
#!/bin/bash

VAULT="$HOME/...path to my vault"
BLOG_DIR="$HOME/repo/...path to my repo"

# copy all markdown files (adjust if you only want specific ones)
cp "$VAULT"/*.md "$BLOG_DIR/"

# move into repo, add, commit, push
cd "$HOME/repos/2025-portfolio" || exit
git add content/blog
git commit -m "Publish blog post(s)"
git push
```
**So there it is -- its simple as:**
- Copy all the files in my vault into my repo
- run a simple little git script

## Obsidian Integration
Now this was the *more fun* part -- I had the script but I wanted to be able to just click a button and push any changes that were made straight into the repo. Now need to open my terminal, run a bash script, and wait.
### Templater
Templater is really just used to create my blog posts outline it looks a little like this:
```
File Name
---
Properties necessary
time, date, excerpt, etc

{{title}}
{{content}}
```
simple as can be!
### Shell Command
Okay -- I had the script, but how do I make Obsidian *aware* of this script? This is where the Shell Commands plugin comes in handy. Shell commands lets you create new commands with an Alias and put them into your Obsidian command palette (cmd + shift + P)! 

But now just one more step, I need a button to make my life easier.
### Commander
Commander puts everything together. It lets you take commands from your command palette and add them to your sidebar. It even lets you give it a little icon if you want to (I went with the Github icon). *Note: I need to figure out the best way to handle images too now*

Anyway, now I click that button on my side bar, Shell Commands runs the custom command I create, that command reference the script -- then boom my changes are live on Github which triggers a new Vercel deploy!