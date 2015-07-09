#Guidelines for writing tutorials

These are some suggestions for writing tutorials or "how to" documents. Some guidelines may not apply to your product or workflow.

Use tutorials when you want to guide a user through a workflow. A tutorial is one way users can learn how to perform a task, and they may likely retain the information better when doing it on their own. Tutorials should represent the best practices for using that product and the simplest workflows, and not "hacks" or workarounds.

Written tutorials can have a long lifespan, and should be updated when software changes. Blogs are valuable, but they often end up being snapshots of functionality at the time of writing (and it is very frustrating to get stuck in a tutorial because the steps are old). Tutorials can be posted on the Mapzen website, and also be provided for training events, such as Maptime or workshops. They can be targeted to many different audiences and levels. Some potential audiences include transportation planners with no map experience, advanced GIS professionals with no transportation domain knowledge, developers, users, and so on.  

##Introduction
In the first few paragraphs, introduce the topic and provide an overview of the workflow to be performed. In the introduction, include information about:
- summary of the tasks to be performed and the scenario the tutorial covers.
- how long it is expected to take to complete the tutorial.
- the level of prerequisite knowledge that is expected (for example, beginner or no expectations, advanced programming skills, and so on).

###Requirements list
In the introduction, state the prerequisites to perform the tutorial. You can include this as a bullet list in a Requirements section. These are some items to consider for requirements.
- Any required operating system, machine configuration, or development tools or environments required. If the steps are written for Mac, but someone could likely follow along on Windows, say so.
- Specific software or hardware requirements. For software, you may want to include release numbers, such as QGIS 2.8.
- Whether Internet access is required, especially if you need to have it consistently through the exercises or to download large volumes of data. Some users will want to do tutorials in disconnected environments (airplanes, subways), while others may be in developing regions and lack continuous high-speed networks.
- Any additional accounts, such as GitHub, or permissions that are necessary.
- The recommended or tested hardware and minimum operating system release for tutorials intended for mobile devices.

##Steps
Start with a some introductory text that explains what the next section will do and why you are going to perform the upcoming tasks. Readers like to know the reasoning behind their actions, especially if they are working through a real-world scenario.
- Number the steps, starting with 1. in each section.
- Indent the steps, related images, and any paragraphs within the steps.
- Normally, each section would have its own numbering scheme with only one 1., but with Markdown, you will likely need to restart numbering at 1. within a section if you have much explanatory text or images between tasks.
- Break sections into reasonable chunks. There will usually be fewer than 10 steps in a section. Having multiple sections sets points where readers can take a break and makes the document easier to scan.
- Include all the relevant steps in the expected amount of detail. If you give detailed instructions for how to perform a task earlier, you can list shortcuts if the same task is done later. For example, the first time you tell a user to open a layer properties dialog box in QGIS, give the full directions. Later on, you can introduce a keyboard shortcut or say "Open the layer Properties...".

##General thoughts
- Make the tutorial approachable.
- Do not assume prior knowledge, and if you do, be very clear about the expectations and provide links to resources for more information. For example, if you have established that some knowledge of git or GitHub workflows is necessary, include a link to the GitHub documentation.
- Do not start the exercise with a block of command line text. Many README files on GitHub are notorious for this, and it is very offputting to non-developers or even experienced developers who are new to an environment or language.
