export const apiClient = {
  payments: {
    'submit-card-infos': {
      $post: async (params: unknown) => {
        console.log(`POST /payments/submit-card-infos ${JSON.stringify(params)}`);
      },
    },
  },
};
