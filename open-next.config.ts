import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// App chỉ có trang SSG không revalidate (sổ tay văn hóa) nên dùng cache đọc từ Static Assets, không cần R2.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Không bật enableCacheInterception: lớp chặn cache trả nguyên trang RSC cho request prefetch theo segment
  // (header Next-Router-Segment-Prefetch của Next.js 16), khiến trình duyệt prefetch lại liên tục hàng trăm lần mỗi giây.
  enableCacheInterception: false,
});
