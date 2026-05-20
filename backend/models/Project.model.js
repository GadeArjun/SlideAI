import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    slideId: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["hero", "content", "closing"],
      default: "content",
    },

    template: {
      type: String,
      default: "",
    },

    templateDirection: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    prompt: {
      type: String,
      default: "",
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Presentation",
      trim: true,
    },

    userPrompt: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "intent_processing",
        "slides_generating",
        "completed",
        "failed",
      ],
      default: "draft",
    },

    theme: {
      backgroundColor: {
        type: String,
        default: "#000000",
      },

      surfaceColor: {
        type: String,
        default: "#171717",
      },

      primaryTextColor: {
        type: String,
        default: "#FFFFFF",
      },

      secondaryTextColor: {
        type: String,
        default: "#A3A3A3",
      },

      accentColor: {
        type: String,
        default: "#F59E0B",
      },

      fontFamily: {
        type: String,
        default: "Calibri",
      },
    },

    intentParser: {
      prompt: {
        type: String,
        default: "",
      },

      parsedData: {
        presentation: {
          title: {
            type: String,
            default: "",
          },

          topic: {
            type: String,
            default: "",
          },

          goal: {
            type: String,
            default: "",
          },

          audience: {
            type: String,
            default: "",
          },

          tone: {
            type: String,
            default: "",
          },

          totalSlides: {
            type: Number,
            default: 0,
          },
        },

        slides: {
          type: [SlideSchema],
          default: [],
        },
      },

      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },

      error: {
        type: String,
        default: "",
      },
    },

    slides: {
      type: [SlideSchema],
      default: [],
    },

    generatedPptx: {
      url: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },
    },

    logs: [
      {
        step: String,

        message: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({
  userId: 1,
  createdAt: -1,
});

ProjectSchema.index({
  userId: 1,
  status: 1,
});

ProjectSchema.index({
  createdAt: -1,
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
