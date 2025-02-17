import { test } from '@playwright/test';

import {
  loginCockpit,
  ibFrame,
} from './lib/lib';

test.describe('test', () => {
  test('create blueprint', async ({ page }) => {
    await loginCockpit(page, 'admin', 'foobar');
    // await enableComposer(page);
    const frame = await ibFrame(page);

    // image output
    await frame.getByRole('heading', { name: 'Images About image builder' });
    await frame.getByRole('heading', { name: 'Blueprints' });
    await frame.getByRole('heading', { name: 'No blueprints yet' });
    await frame.getByTestId('create-blueprint-action-emptystate').click();
    await frame.getByRole('heading', { name: 'Image output' });
    await frame.getByTestId('checkbox-guest-image').click();
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // fs
    await frame.getByRole('heading', { name: 'Additional packages' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // packages
    await frame.getByRole('heading', { name: 'Additional packages' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // users
    await frame.getByRole('heading', { name: 'Users' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // timezone
    await frame.getByRole('heading', { name: 'Timezone' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // locale
    await frame.getByRole('heading', { name: 'Locale' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // hostname
    await frame.getByRole('heading', { name: 'Hostname' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // kernel
    await frame.getByRole('heading', { name: 'Kernel' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // firewall
    await frame.getByRole('heading', { name: 'Firewall' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // systemd services
    await frame.getByRole('heading', { name: 'Systemd services' });
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // details
    await frame.getByRole('heading', { name: 'Details' });
    await frame.getByTestId('blueprint').fill('test-blueprint');
    await frame.getByRole('button', { name: 'Next', exact: true }).click();

    // review
    await frame.getByRole('button', { name: 'Create blueprint' }).click();
    await frame.getByTestId('close-button-saveandbuild-modal').click();
    await frame.getByRole('button', { name: 'Create blueprint' }).click();

    // landing page
    await frame.getByText('test-blueprint');
  });

  test('edit blueprint', async ({ page }) => {
    await loginCockpit(page, 'admin', 'foobar');
    const frame = await ibFrame(page);
    await frame.getByText('test-blueprint').click();
    await frame.getByRole('button', { name: 'Edit blueprint' }).click();
    await frame.getByRole('button', { name: 'Cancel', exact: true }).click();
    await frame.getByRole('button', { name: 'Edit blueprint' }).click();
    await frame.getByRole('button', { name: 'Save changes to blueprint' }).click();
  });

  test('build blueprint', async ({ page }) => {
    // add time enough for depsolving
    test.setTimeout(60 * 1000);
    await loginCockpit(page, 'admin', 'foobar');
    const frame = await ibFrame(page);
    await frame.getByText('test-blueprint').click();
    await frame.getByTestId('blueprint-build-image-menu-option').click();

    // make sure the image is present
    await frame.getByTestId('images-table').getByText('Fedora');
  });

  test('delete blueprint', async ({ page }) => {
    await loginCockpit(page, 'admin', 'foobar');
    const frame = await ibFrame(page);
    await frame.getByText('test-blueprint').click();
    await frame.getByTestId('blueprint-action-menu-toggle').click();
    await frame.getByRole('menuitem', { name: 'Delete blueprint' }).click();
    await frame.getByRole('button', { name: 'Delete' }).click();
  });

  test('discover image', async ({ page }) => {
    // TODO instead of waiting for the build to get ready, just write a dummy artifact
    // await frame.getByRole('gridcell', { name: 'Ready' });
    // await frame.getByRole('link', { name: 'Open in file browser' }).click();
    // const filesFrame = await page.locator('iframe[name="cockpit1\\:localhost\\/files"]').contentFrame()
    // await filesFrame.getByRole('link', { name: 'disk.qcow2' });
  })
});
