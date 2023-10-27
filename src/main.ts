import * as core from '@actions/core'
import asana from 'asana'

async function run(): Promise<void> {
  try {
    const token = core.getInput('asana-secret', {required: true})
    core.setSecret(token)
    const client = asana.Client.create({
      defaultHeaders: {
        'asana-enable': 'new_project_templates,new_user_task_lists'
      }
    }).useAccessToken(token)

    const workspaceId = core.getInput('asana-workspace-id', {required: true})
    const projectId = core.getInput('asana-project-id', {required: true})
    const sectionId = core.getInput('asana-section-id')
    const taskName = core.getInput('asana-task-name', {required: true})
    const taskDescription = core.getInput('asana-task-description')
    const dueDate = core.getInput('asana-due-date')
    const tags = core.getInput('asana-tags')
    const customFields = core.getInput('asana-custom-fields')

    const memberships = sectionId
      ? [{project: projectId, section: sectionId}]
      : undefined

    await client.tasks.create({
      workspace: workspaceId,
      projects: [projectId],
      memberships,
      name: taskName,
      notes: taskDescription,
      due_on: dueDate,
      tags: tags ? JSON.parse(tags) : undefined,
      custom_fields: customFields ? JSON.parse(customFields) : undefined
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
