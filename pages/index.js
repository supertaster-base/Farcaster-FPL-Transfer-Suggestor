useEffect(() => {
  async function initFarcaster() {
    if (typeof window === "undefined") return;

    try {
      const miniappModule = await import("@farcaster/miniapp-sdk");
      const miniapp = miniappModule.default || miniappModule;

      if (!miniapp?.actions?.ready) {
        console.warn("⚠ miniapp.actions.ready not found", miniapp);
        return;
      }

      await miniapp.actions.ready();
      console.log("✅ Farcaster Mini App ready");
    } catch (err) {
      console.error("❌ Farcaster SDK init failed:", err);
    }
  }

  initFarcaster();
}, []);
