useEffect(() => {
  let mounted = true;

  async function initFarcaster() {
    if (typeof window === "undefined") return;

    try {
      const { actions } = await import("@farcaster/miniapp-sdk");

      if (!mounted) return;

      await actions.ready();
      console.log("✅ Farcaster Mini App ready");
    } catch (err) {
      console.error("❌ Farcaster SDK init error:", err);
    }
  }

  initFarcaster();
  return () => { mounted = false };
}, []);
