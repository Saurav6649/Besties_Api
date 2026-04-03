const FriendApiDoc = {
  "/friend": {
    post: {
      summary: "send a friend request",
      description: "Access token required !",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                friend: { type: "string", example: "your_friend_id" },
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
                  message: {
                    type: "string",
                    example: "Friend Request Sent",
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
    get: {
      summary: "Fetch your friend ",
      description: "Access token required !",
      responses: {
        200: {
          description: "Success",
          content: {
            "applicaiton/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    friend: {
                      type: "object",
                      properties: {
                        fullname: { type: "string" },
                        email: { type: "string" },
                        mobile: { type: "string" },
                        image: { type: "string" },
                      },
                    },
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
  "/friend/{id}": {
    put: {
      summary: "Accept friend request",
      description: "Access token required !",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          default: 0,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "accepted" },
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
                  status: {
                    type: "string",
                    example: "friend status updated",
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
                    example: "Friend status updated",
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
    delete: {
      summary: "Unfollow or reject friend request",
      description: "Access token required !",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          default: 0,
          schema: { type: "string" },
        },
      ],

      responses: {
        200: {
          description: "Success",
          content: {
            "applicaiton/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "friend Deleted",
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
                    example: "Friend status updated",
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
  "/friend/suggestion": {
    get: {
      summary: "Get Friend Suggestion",
      description: "Access token required !",
      responses: {
        200: {
          description: "Success",
          content: {
            "applicaiton/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    fullname: { type: "string" },
                    email: { type: "string" },
                    mobile: { type: "string" },
                    image: { type: "string" },
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
};

export default FriendApiDoc;
