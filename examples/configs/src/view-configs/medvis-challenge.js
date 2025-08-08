export const medvisChallenge = {
  version: '1.0.6',
  name: 'Medvis Challenge',
  description: 'What are we even doing?.',
  public: true,
  datasets: [
    {
      uid: 'Melanoma',
      name: 'Melanoma',
      files: [
        {
          fileType: 'image.ome-zarr',
          url: 'https://lsp-public-data.s3.amazonaws.com/biomedvis-challenge-2025/Dataset1-LSP13626-melanoma-in-situ/0',
        },
      ],
    },
  ],
  initStrategy: 'auto',
  layout: [
    {
      component: 'spatial',
      x: 0,
      y: 0,
      w: 8,
      h: 12,
    },
    {
      component: 'layerController',
      x: 8,
      y: 0,
      w: 4,
      h: 6,
    },
    {
      component: 'description',
      x: 8,
      y: 6,
      w: 4,
      h: 3,
    },
    {
      component: 'status',
      x: 8,
      y: 9,
      w: 4,
      h: 3,
    },
  ],
};
