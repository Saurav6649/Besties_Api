const StorageApiDoc = {
  "/storage/download": {
    post: {
      summary: "Get Signed Url For Download",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                path: { type: "string", example: "folder/file.ext" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "applicaiton/json": {
              schema: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    example: "signed url valid for 60 sec",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid Session",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/storage/upload": {
    post: {
      summary: "Get Signed Url For Upload",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                path: { type: "string", example: "folder/file.ext" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "applicaiton/json": {
              schema: {
                type: "object",
                properties: {
                  path: { type: "string", example: "folder/file.ext" },
                  type: { type: "string", example: "image/png" },
                  status: { type: "string", example: "private | public-read" },
                },
              },
            },
          },
        },
        401: {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid Session",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default StorageApiDoc;
