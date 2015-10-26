# Documentation authoring instructions

You can get help at [mapzen.com/documentation](https://mapzen.com/documentation/), or click `Documentation` in the top header on any page on [mapzen.com](https://mapzen.com) to take you there.

This site brings together all Mapzen's documentation in one place. The underlying source help files are in GitHub, but display them in a way that is easy to navigate and visually pleasing. In addition, putting the help on mapzen.com connects it to the resources on the website, such as signing up for API keys. 

## Main repositories

[mapzen-docs-generator](https://github.com/mapzen/mapzen-docs-generator): contains the configuration files and visual themes of the resulting site. Anytime there is a change to mapzen-docs-generator, CircleCI rebuilds the site.

[mapzen-docs]((https://github.com/mapzen/mapzen-docs): contains the source markdown files for the help system.

## Where to put help content

Documentation source files were spread across multiple GitHub organizations and repositories. After some internal discussion about where to put the files, the existing help source files were moved to a central, public repository at [mapzen-docs](https://github.com/mapzen/mapzen-docs) in the Mapzen organization. Each project or section of the help has its own folder in this repository.

The reasoning behind this was having help that is all about the Mapzen-hosted services (such as Mapzen Turn-by-Turn) could be confusing to developers who want to use the source libraries to build their own on-premises instances (such as Valhalla). It could also be discouraging to public contributions to keep seeing content that is dominated by the Mapzen services, which may be irrelevant. The plan was for on-premises information to be in the project organization's repository.

However, this does cause a few problems:

1. How do we solve the duplication between the markdown files in the original repositories and in mapzen-docs?
2. How do we track documentation tasks and issues? If the help files are in mapzen-docs, this separates it from planning tools, such as Trello and waffle.io. 
3. How do we minimize notifications and potential edit conflicts that can occur from disparate groups editing the same content?
4. What info goes in the mapzen-docs repository, versus the project organization repository (such as valhalla-docs)? 

Each help topic has an `Edit this page on GitHub` link that points back to the source markdown file in mapzen-docs. You can then edit a topic and submit a pull request, or add an issue about the content.

## Update the table of contents (add a topic, remove one, rename it in the table of contents)

To display on the documentation site, you need to add a topic to a configuration file. Otherwise, the topic exists only in the repository.

1. Go to https://github.com/mapzen/mapzen-docs-generator/tree/master/config
2. Find the .yml file for your section of help. For example, Mapzen Turn-by-Turn can be found in turn-by-turn.yml.
3. Under `pages:`, make the change to the table of contents. `Home:` should always be only `index.md.` Add topics by including a heading, contained in single quotation mark, followed by a colon and the name of the md file. For example, `'API Reference': 'api-reference.md'` 
4. You can add nesting in the table of contents by indenting the lines underneath the heading. 
```json
- Concept overviews:
  - 'The Scene File': 'Scene-file.md'
```

## Build and deploy the help system website

The help system is built with an open-source Python tool called [MkDocs](http://www.mkdocs.org/), which formats GitHub markdown files in to a static, HTML website. MkDocs also creates a table of contents, a simple keyword search, navigation breadcrumbs, and links to move back and forward between topics. Note that while MkDocs reads just one source, Mapzen has enhanced the generator to integrate multiple repositories.

The help system build process is part of CircleCI, so the development site at [dev.mapzen.com](https://dev.mapzen.com/documentation/) is rebuilt automatically following a change. Currently, CircleCI only tracks the the master branch of the mapzen-docs-generator repository, so you will need to use CircleCI to rebuild manually to pick up content changes that occur in the help markdown files. (There is an open issue to make CircleCI track the help files themselves).

When you are ready to deploy the changes, create a pull request from the master branch of mapzen-docs-generator to the production branch.
