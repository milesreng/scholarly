import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:31000/')
  await page.getByText('Login via DS').click()

  await page.getByLabel('Login Key').fill('abcdefg')
  await page.getByLabel('Username').fill('test')
  await page.getByLabel('Role').fill('admin')

  await page.getByRole('link', { name: 'Log in'}).click()
})

const TASK_ITEMS = []

test.describe('Interacting with projects', () => {
  test('create new projects', async ({ page }) => {
    
    await page.getByText('Create a new project').click()
    await page.getByLabel('Title').fill('COMPSCI 590 Final Project')
    await page.getByLabel('Description').fill('Advanced web development final project')
    // await page.getByLabel('Members').fill('user1')
  
    const responsePromise = page.waitForResponse((response) => {
      return response.status() === 200
    })
  
    await page.getByRole('button', { name: 'Create' }).click()
  
    const response = await responsePromise

    await expect(page.getByRole('link', { name: 'COMPSCI 590 Final Project' })).toBeVisible()
  });

  test('view and edit project', async ({ page }) => {
    await page.getByRole('link', { name: 'COMPSCI 590 Final Project' }).click()

    await page.locator('.row > span').first().click()
    
    await page.getByLabel('Title').fill('COMPSCI 590 - Smoothie Stand Final Project')
    await page.getByLabel('Description').fill('Extend the smoothie stand example using OIDC and host on Kubernetes')

    const responsePromise = page.waitForResponse((response) => {
      return response.status() === 200
    })
  
    await page.getByRole('button', { name: 'Save changes' }).click()
  
    const response = await responsePromise
    await expect(page.getByText('Project: COMPSCI 590 - Smoothie Stand')).toBeVisible()
  })
})

test.describe('Interacting with tasks', () => {

  test('create a new task', async ({ page }) => {

    await page.getByRole('link', { name: 'COMPSCI 590 Final Project' }).click()
    
    await page.getByText('Create a new task').click()

    await page.getByLabel('Title').fill('Develop mock-ups for app')
    await page.getByLabel('Description').fill('4-5 slides describing general outline')
    // await page.getByLabel('Due Date').fill('2024-04-25')

    await page.getByLabel('Assign to').selectOption('test')

    const responsePromise = page.waitForResponse((response) => {
      return response.status() === 200
    })

    await page.getByRole('button', { name: 'Save' }).click()

    const response = await responsePromise

    await expect(page.getByText('Assigned to test')).toBeVisible()
  })

  test('Update task status', async ({ page }) => {
    await page.getByRole('link', { name: 'COMPSCI 590 Final Project' }).click()

    await page.getByText('Develop mock-ups for app').click()


  })
})

