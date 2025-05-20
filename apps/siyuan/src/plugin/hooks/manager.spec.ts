import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { HookManager } from "@/plugin/hooks/manager.ts"

describe("HookManager", () => {
  let hookManager: HookManager

  beforeEach(() => {
    hookManager = HookManager.getInstance()
    hookManager.clearAllHooks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Global hook Registration", () => {
    // it("should successfully register a hook", () => {
    //   const hook = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS)).toContain(
    //     hook,
    //   )
    // })
    //
    // it("should not register duplicate hooks", () => {
    //   const hook = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS).length).toBe(
    //     1,
    //   )
    // })
    //
    // it("should register multiple hooks for the same stage", () => {
    //   const hook1 = vi.fn()
    //   const hook2 = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook1)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook2)
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS).length).toBe(
    //     2,
    //   )
    // })
    // it("should handle registration with invalid stage", () => {
    //   const hook = vi.fn()
    //   // @ts-ignore
    //   expect(() => hookManager.registerGlobalHook("INVALID_STAGE", hook)).toThrow("Invalid hook stage: INVALID_STAGE")
    //   // 验证所有阶段的钩子数量都为 0
    //   Object.values(HookStage).forEach((stage) => {
    //     expect(hookManager.getGlobalHooks(stage).length).toBe(0)
    //   })
    // })
  })

  describe("Plugin hook Registration", () => {
    // it("should successfully register a plugin hook", () => {
    //   const hook = vi.fn()
    //   hookManager.registerPluginHook("test-plugin", HookStage.BEFORE_PROCESS, hook)
    //   const hooks = hookManager.getPluginHooks("test-plugin", HookStage.BEFORE_PROCESS)
    //   expect(hooks).toContain(hook)
    // })
    //
    // it("should not register duplicate plugin hooks", () => {
    //   const hook = vi.fn()
    //   hookManager.registerPluginHook("test-plugin", HookStage.BEFORE_PROCESS, hook)
    //   hookManager.registerPluginHook("test-plugin", HookStage.BEFORE_PROCESS, hook)
    //   const hooks = hookManager.getPluginHooks("test-plugin", HookStage.BEFORE_PROCESS)
    //   expect(hooks).toHaveLength(1)
    // })
    //
    // it("should register multiple plugin hooks for the same stage", () => {
    //   const hook1 = vi.fn()
    //   const hook2 = vi.fn()
    //   hookManager.registerPluginHook("test-plugin-1", HookStage.BEFORE_PROCESS, hook1)
    //   hookManager.registerPluginHook("test-plugin-2", HookStage.BEFORE_PROCESS, hook2)
    //
    //   const hook11 = hookManager.getPluginHooks("test-plugin-1", HookStage.BEFORE_PROCESS)
    //   expect(hook11).toHaveLength(1)
    //   const hook22 = hookManager.getPluginHooks("test-plugin-2", HookStage.BEFORE_PROCESS)
    //   expect(hook22).toHaveLength(1)
    // })
    //
    // it("should handle registration with invalid plugin name or stage", () => {
    //   const hook = vi.fn()
    //   // @ts-ignore
    //   hookManager.registerPluginHook("", HookStage.BEFORE_PROCESS, hook)
    //   expect(hookManager.getPluginHooks("test-plugin", HookStage.BEFORE_PROCESS)).toBeUndefined()
    //
    //   expect(() => {
    //     // @ts-ignore
    //     hookManager.registerPluginHook("test-plugin", "INVALID_STAGE", hook)
    //   }).toThrow("Invalid hook stage: INVALID_STAGE")
    //   // @ts-ignore
    //   expect(hookManager.getPluginHooks("test-plugin", "INVALID_STAGE")).toBeUndefined()
    // })
  })

  describe("Hook Execution", () => {
    // it("should execute registered hooks in order", async () => {
    //   const executionOrder: number[] = []
    //   const hook1 = vi.fn().mockImplementation(async () => {
    //     executionOrder.push(1)
    //     return { success: true, data: {} }
    //   })
    //   const hook2 = vi.fn().mockImplementation(async () => {
    //     executionOrder.push(2)
    //     return { success: true, data: {} }
    //   })
    //
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook1)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook2)
    //
    //   const context: HookContext = { id: "test", config: new PublishConfig(), post: new Post(), data: {} }
    //   await hookManager.executeHooks(HookStage.BEFORE_PROCESS, context)
    //   expect(executionOrder).toEqual([1, 2])
    // })
    //
    // it("should handle hook execution failures gracefully but continue others", async () => {
    //   const successfulHook = vi.fn().mockResolvedValue({ success: true, data: {} })
    //   const failingHook = vi.fn().mockResolvedValue({
    //     success: false,
    //     error: new Error("Hook failed"),
    //   })
    //   const failingHook2 = vi.fn().mockResolvedValue({
    //     success: false,
    //     error: new Error("Hook failed2"),
    //   })
    //
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, failingHook)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, failingHook2)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, successfulHook)
    //
    //   const context: HookContext = { id: "test", config: new PublishConfig(), post: new Post(), data: {} }
    //   const result = await hookManager.executeHooks(HookStage.BEFORE_PROCESS, context)
    //
    //   expect(result.success).toBe(false)
    //   expect(result.error?.message).toBe("Hook failed;\nHook failed2")
    //   console.log("test ok")
    // })
    //
    // it("should handle async timeout in hook execution", async () => {
    //   const timeoutHook = vi.fn().mockImplementation(async () => {
    //     await new Promise((resolve) => setTimeout(resolve, 2000))
    //     return { success: true, data: {} }
    //   })
    //
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, timeoutHook)
    //
    //   const context: HookContext = { id: "test", config: new PublishConfig(), post: new Post(), data: {} }
    //   const result = await hookManager.executeHooks(HookStage.BEFORE_PROCESS, context)
    //   expect(result.success).toBe(true)
    //   expect(result.error).toBeUndefined()
    // })
    //
    // it("should pass context data between hooks", async () => {
    //   const hook1 = vi.fn().mockImplementation(async (context) => {
    //     return {
    //       success: true,
    //       data: { modified: true },
    //     }
    //   })
    //
    //   const hook2 = vi.fn().mockImplementation(async (context) => {
    //     expect(context.data.modified).toBe(true)
    //     return { success: true, data: context.data }
    //   })
    //
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook1)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook2)
    //
    //   const context: HookContext = { id: "test", config: new PublishConfig(), post: new Post(), data: {} }
    //   await hookManager.executeHooks(HookStage.BEFORE_PROCESS, context)
    // })
  })

  describe("Hook Unregistration", () => {
    // it("should successfully unregister a hook", () => {
    //   const hook = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   hookManager.unregisterGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS)).not.toContain(hook)
    // })
    //
    // it("should return false when unregistering non-existent hook", () => {
    //   const hook = vi.fn()
    //   expect(() => {
    //     hookManager.unregisterGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   }).not.toThrow()
    // })
    //
    // it("should handle unregistration with invalid stage", () => {
    //   const hook = vi.fn()
    //   expect(() => {
    //     // @ts-ignore
    //     hookManager.unregisterGlobalHook("INVALID_STAGE", hook)
    //   }).toThrowError("Invalid hook stage: INVALID_STAGE")
    // })
  })

  describe("Hook Management", () => {
    // it("should clear all hooks", () => {
    //   const hook1 = vi.fn()
    //   const hook2 = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook1)
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PUBLISH, hook2)
    //
    //   hookManager.clearGlobalHooks()
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS)).toHaveLength(0)
    //   expect(hookManager.getGlobalHooks(HookStage.BEFORE_PUBLISH)).toHaveLength(0)
    // })
    //
    // it("should get hooks for specific stage", () => {
    //   const hook = vi.fn()
    //   hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, hook)
    //   const hooks = hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS)
    //   expect(hooks).toContain(hook)
    // })
    //
    // it("should return empty array for stage with no hooks", () => {
    //   const hooks = hookManager.getGlobalHooks(HookStage.BEFORE_PROCESS)
    //   expect(hooks).toHaveLength(0)
    // })
  })
})
