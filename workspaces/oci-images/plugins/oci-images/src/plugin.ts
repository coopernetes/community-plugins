import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const ociImagesPlugin = createPlugin({
  id: 'oci-images',
  routes: {
    root: rootRouteRef,
  },
});

export const OciImagesPage = ociImagesPlugin.provide(
  createRoutableExtension({
    name: 'OciImagesPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
