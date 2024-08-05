import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { ociImagesPlugin, OciImagesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(ociImagesPlugin)
  .addPage({
    element: <OciImagesPage />,
    title: 'Root Page',
    path: '/oci-images',
  })
  .render();
