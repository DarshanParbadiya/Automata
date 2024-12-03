import z from 'zod';

export const ZapCreateSchema = z.object({
  availableTriggerId: z.string().uuid(),
  triggerMetaData: z.any().optional(),
  actions : z.array(z.object({
    availableActionId: z.string().uuid(),
    actionMetaData: z.any().optional()
  }))
});

// export 