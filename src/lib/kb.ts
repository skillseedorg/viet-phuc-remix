/**
 * Kho tri thức văn hóa (knowledge base) của Việt phục Remix.
 * Mọi thông tin hiển thị cho người dùng và mọi prompt AI đều lấy từ file này.
 * Mỗi nhận định gắn một mức độ tin cậy để người dùng phân biệt
 * tư liệu lịch sử với cách hiểu dân gian hoặc giả thuyết.
 */

export type Confidence = "tu-lieu" | "dan-gian" | "gia-thuyet";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  "tu-lieu": "Có tư liệu",
  "dan-gian": "Cách hiểu dân gian",
  "gia-thuyet": "Còn nhiều giả thuyết",
};

export type Fact = { text: string; confidence: Confidence };

export type Source = { title: string; note?: string; url?: string };

export const SOURCES: Record<string, Source> = {
  "ngan-nam-ao-mu": {
    title: "Trần Quang Đức — Ngàn năm áo mũ",
    note: "Nhã Nam, 2013. Khảo cứu trang phục Việt từ thời Lý đến Nguyễn.",
  },
  "phu-bien-tap-luc": {
    title: "Lê Quý Đôn — Phủ biên tạp lục",
    note: "1776. Có ghi chép về việc chúa Nguyễn Phúc Khoát định lại y phục ở Đàng Trong.",
  },
  "doan-thi-tinh": {
    title: "Đoàn Thị Tình — Trang phục Việt Nam",
    note: "NXB Mỹ thuật. Tổng quan trang phục các thời kỳ.",
  },
  "bt-dan-toc-hoc": {
    title: "Bảo tàng Dân tộc học Việt Nam",
    url: "https://www.vme.org.vn",
  },
  "bt-phu-nu": {
    title: "Bảo tàng Phụ nữ Việt Nam — sưu tập trang phục",
    url: "https://baotangphunu.org.vn",
  },
  "hue-heritage": {
    title: "Trung tâm Bảo tồn Di tích Cố đô Huế",
    url: "https://hueworldheritage.org.vn",
  },
  "phong-hoa": {
    title: "Báo Phong Hóa, Ngày Nay (1934–1935)",
    note: "Nơi họa sĩ Cát Tường (Le Mur) giới thiệu các mẫu áo cách tân.",
  },
};

/* ------------------------------------------------------------------ */
/* Vùng miền                                                           */
/* ------------------------------------------------------------------ */

export type RegionId = "bac" | "trung" | "nam";

export const REGIONS: { id: RegionId; name: string; hint: string }[] = [
  { id: "bac", name: "Bắc Bộ", hint: "Kinh Bắc, quan họ, áo tứ thân, nón quai thao" },
  { id: "trung", name: "Trung Bộ", hint: "Cố đô Huế, áo nhật bình, tím Huế, nón bài thơ" },
  { id: "nam", name: "Nam Bộ", hint: "Áo bà ba, khăn rằn, lãnh Mỹ A đen tuyền" },
];

/* ------------------------------------------------------------------ */
/* Trang phục                                                          */
/* ------------------------------------------------------------------ */

export type GarmentId =
  | "ao-dai"
  | "ao-tu-than"
  | "ao-ngu-than"
  | "ao-ba-ba"
  | "ao-nhat-binh"
  | "ao-tac";

export type Garment = {
  id: GarmentId;
  name: string;
  tagline: string;
  era: string;
  regions: RegionId[] | "ca-nuoc";
  summary: string;
  origin: Fact[];
  meaning: Fact[];
  anatomy: { part: string; desc: string }[];
  traditionalWith: string[];
  remixOk: string[];
  remixCareful: string[];
  fabrics: string[];
  sources: string[];
};

export const GARMENTS: Garment[] = [
  {
    id: "ao-dai",
    name: "Áo dài",
    tagline: "Hai tà dài, xẻ hông, mặc cùng quần",
    era: "Định hình từ thập niên 1930, phát triển đến nay",
    regions: "ca-nuoc",
    summary:
      "Áo dài hiện đại ôm thân, hai tà trước sau dài quá gối, xẻ hai bên hông từ eo, mặc cùng quần dài. Đây là trang phục được xem như biểu tượng văn hóa của Việt Nam.",
    origin: [
      { text: "Áo dài phát triển từ áo ngũ thân, loại áo phổ biến từ thế kỷ 18.", confidence: "tu-lieu" },
      {
        text: "Khoảng năm 1934–1935, họa sĩ Cát Tường (bút danh Le Mur) giới thiệu các mẫu áo cách tân trên báo Phong Hóa, Ngày Nay; họa sĩ Lê Phổ sau đó điều chỉnh theo hướng dung hòa hơn.",
        confidence: "tu-lieu",
      },
      {
        text: "Thập niên 1960 tại Sài Gòn, kiểu tay raglan (tay liền từ cổ xuống) giúp áo ôm vai và gọn hơn, trở thành dáng quen thuộc ngày nay.",
        confidence: "tu-lieu",
      },
    ],
    meaning: [
      { text: "Được dùng làm đồng phục nữ sinh ở nhiều trường, gắn với hình ảnh tuổi học trò.", confidence: "tu-lieu" },
      { text: "Vừa kín đáo vừa tôn dáng, thường được nhắc đến như vẻ đẹp dịu dàng, thanh lịch.", confidence: "dan-gian" },
    ],
    anatomy: [
      { part: "Cổ đứng", desc: "Cổ cao ôm cổ, thường 2–4 cm." },
      { part: "Hai tà", desc: "Tà trước và tà sau dài quá gối, thường tới mắt cá." },
      { part: "Xẻ tà", desc: "Xẻ hai bên hông, bắt đầu từ ngang eo." },
      { part: "Hàng khuy", desc: "Chạy từ cổ chéo sang nách phải rồi xuống hông." },
      { part: "Quần", desc: "Quần dài ống rộng, thường bằng lụa, trắng hoặc cùng tông áo." },
    ],
    traditionalWith: ["Quần lụa", "Nón lá", "Khăn vấn hoặc khăn mấn (dịp cưới)", "Guốc mộc hoặc giày hài"],
    remixOk: [
      "Thay quần lụa bằng quần ống suông cùng tông cho dịp dạo phố",
      "Khoác blazer hoặc cardigan mỏng khi trời lạnh",
      "Đi sneaker trắng tối giản khi chụp ảnh ngoài phố",
      "Chọn tà qua gối (áo dài cách tân) cho sự kiện không quá trang trọng",
    ],
    remixCareful: [
      "Cắt tà ngắn lên trên hông khiến áo mất đặc điểm nhận diện; khi đó nên gọi là áo lấy cảm hứng từ áo dài",
      "Bỏ quần, mặc áo dài như váy ngắn không phù hợp ở chùa, lễ nghi, trường học",
    ],
    fabrics: ["Lụa tơ tằm", "Gấm", "Voan", "Nhung (mùa lạnh)"],
    sources: ["phong-hoa", "ngan-nam-ao-mu", "bt-phu-nu"],
  },
  {
    id: "ao-tu-than",
    name: "Áo tứ thân",
    tagline: "Bốn vạt, mặc ngoài yếm, thắt lưng buộc trước",
    era: "Phổ biến ở Bắc Bộ nhiều thế kỷ, đến đầu thế kỷ 20",
    regions: ["bac"],
    summary:
      "Áo tứ thân gồm bốn vạt: hai vạt sau khâu liền ở sống lưng, hai vạt trước để buông hoặc buộc vào nhau. Áo mặc ngoài chiếc yếm, cùng váy dài và thắt lưng lụa. Hình ảnh quen thuộc với vùng Kinh Bắc và dân ca quan họ.",
    origin: [
      { text: "Là trang phục thường ngày và lễ hội của phụ nữ người Việt ở Bắc Bộ trước thế kỷ 20.", confidence: "tu-lieu" },
      { text: "Ngày thường mặc áo màu nâu, màu sẫm; ngày hội mặc nhiều lớp áo nhiều màu gọi là áo mớ ba, mớ bảy.", confidence: "tu-lieu" },
    ],
    meaning: [
      { text: "Bốn vạt áo được cho là tượng trưng cho tứ thân phụ mẫu: cha mẹ mình và cha mẹ người bạn đời.", confidence: "dan-gian" },
      { text: "Gắn chặt với hình ảnh liền anh, liền chị quan họ Bắc Ninh, là di sản văn hóa phi vật thể được UNESCO ghi danh năm 2009.", confidence: "tu-lieu" },
    ],
    anatomy: [
      { part: "Hai vạt sau", desc: "Khâu liền nhau dọc sống lưng." },
      { part: "Hai vạt trước", desc: "Để buông tự do hoặc buộc lại trước bụng." },
      { part: "Yếm", desc: "Mặc bên trong, lộ ra ở phần ngực." },
      { part: "Thắt lưng", desc: "Dải lụa màu, thường xanh hoa lý hoặc hồng đào, buộc ở eo và buông đuôi." },
      { part: "Váy", desc: "Váy dài màu sẫm (váy đụp, váy sồi)." },
    ],
    traditionalWith: ["Yếm", "Váy dài màu sẫm", "Thắt lưng lụa màu", "Khăn mỏ quạ", "Nón quai thao"],
    remixOk: [
      "Dùng áo tứ thân chất liệu nhẹ khoác ngoài áo hai dây kín đáo thay cho yếm khi đi chụp ảnh",
      "Phối chân váy midi màu trầm thay cho váy đụp",
      "Giữ nón quai thao làm điểm nhấn trong bộ ảnh concept",
    ],
    remixCareful: [
      "Mặc yếm như áo ngoài khi đến chùa, đình, sự kiện trang trọng dễ bị xem là thiếu tế nhị",
      "Thay váy dài bằng váy ngắn hoặc quần short làm mất dáng áo tứ thân, dễ phản cảm ở lễ hội",
    ],
    fabrics: ["Lụa", "The", "Vải nâu nhuộm củ nâu", "Đũi"],
    sources: ["doan-thi-tinh", "bt-phu-nu", "bt-dan-toc-hoc"],
  },
  {
    id: "ao-ngu-than",
    name: "Áo ngũ thân",
    tagline: "Năm thân, cổ đứng, cài khuy bên phải",
    era: "Từ năm 1744 ở Đàng Trong, phổ biến cả nước thời Nguyễn",
    regions: "ca-nuoc",
    summary:
      "Áo ngũ thân có bốn thân chính và một thân con nằm dưới vạt trước, cổ đứng, cài khuy chéo sang bên phải, dáng suông rộng hơn áo dài. Cả nam và nữ đều mặc. Đây là tiền thân trực tiếp của áo dài.",
    origin: [
      {
        text: "Năm 1744, chúa Nguyễn Phúc Khoát định lại y phục ở Đàng Trong, quy định áo có cổ đứng, cài khuy; kiểu áo này về sau phổ biến khắp cả nước.",
        confidence: "tu-lieu",
      },
      { text: "Những năm gần đây được nhiều người trẻ may lại để mặc dịp Tết, lễ hội.", confidence: "tu-lieu" },
    ],
    meaning: [
      { text: "Bốn thân chính tượng trưng cho tứ thân phụ mẫu, thân con thứ năm tượng trưng cho người mặc.", confidence: "dan-gian" },
      { text: "Năm khuy áo tượng trưng cho ngũ thường: nhân, nghĩa, lễ, trí, tín.", confidence: "dan-gian" },
    ],
    anatomy: [
      { part: "Bốn thân chính", desc: "Hai thân trước, hai thân sau." },
      { part: "Thân con", desc: "Vạt nhỏ nằm dưới vạt trước bên phải." },
      { part: "Cổ đứng", desc: "Cổ thấp, cứng." },
      { part: "Khuy áo", desc: "Thường năm khuy: một ở cổ, các khuy còn lại chạy chéo sang phải." },
      { part: "Tay áo", desc: "Tay chẽn (hẹp) khi mặc thường ngày, tay thụng (rộng) khi là lễ phục." },
    ],
    traditionalWith: ["Quần ống rộng", "Khăn vấn (nữ) hoặc khăn đóng (nam)", "Guốc mộc, giày hài"],
    remixOk: [
      "Mặc cùng quần ống suông hiện đại và giày lười da cho dịp Tết",
      "Khoác áo ngũ thân chất đũi màu trung tính ra phố",
      "Chọn hoa văn cát tường nhỏ, rải rác thay cho gấm dày",
    ],
    remixCareful: [
      "Hoa văn rồng năm móng từng là biểu tượng dành riêng cho vua; dùng làm họa tiết thời trang hằng ngày nên cân nhắc",
      "Cài khuy sang trái là sai cấu trúc truyền thống của áo",
    ],
    fabrics: ["Gấm", "Lụa", "Đũi", "The (mùa hè)"],
    sources: ["phu-bien-tap-luc", "ngan-nam-ao-mu"],
  },
  {
    id: "ao-ba-ba",
    name: "Áo bà ba",
    tagline: "Áo ngắn ngang hông, xẻ tà, gắn với Nam Bộ",
    era: "Phổ biến ở Nam Bộ từ cuối thế kỷ 19",
    regions: ["nam"],
    summary:
      "Áo bà ba dáng ngắn ngang hông, không cổ hoặc cổ tròn thấp, xẻ hai bên hông, hàng nút giữa ngực, thường có túi. Mặc cùng quần dài, khăn rằn và nón lá. Đây là trang phục lao động quen thuộc của người Nam Bộ.",
    origin: [
      {
        text: "Nguồn gốc tên gọi và kiểu dáng có nhiều giả thuyết, trong đó có giả thuyết cải biên từ áo của người Mã Lai hoặc người Hoa ở Penang (Baba).",
        confidence: "gia-thuyet",
      },
      { text: "Quần lãnh Mỹ A đen bóng của làng lụa Tân Châu (An Giang) là cách phối kinh điển.", confidence: "tu-lieu" },
    ],
    meaning: [
      { text: "Gọn gàng, thoáng mát, hợp khí hậu nóng ẩm và công việc sông nước.", confidence: "tu-lieu" },
      { text: "Gợi hình ảnh mộc mạc, hiếu khách của người miền Tây.", confidence: "dan-gian" },
    ],
    anatomy: [
      { part: "Thân áo ngắn", desc: "Dài ngang hông hoặc qua hông một chút." },
      { part: "Cổ", desc: "Không cổ hoặc cổ tròn thấp, đôi khi cổ trái tim." },
      { part: "Hàng nút", desc: "Chạy thẳng giữa thân trước." },
      { part: "Túi", desc: "Hai túi phía dưới thân trước." },
      { part: "Xẻ hông", desc: "Xẻ nhỏ hai bên cho dễ cử động." },
    ],
    traditionalWith: ["Quần đen lãnh Mỹ A", "Khăn rằn", "Nón lá", "Guốc mộc hoặc đi chân trần khi làm việc"],
    remixOk: [
      "Phối áo bà ba với quần jeans ống suông cho dạo phố",
      "Khăn rằn làm khăn quàng cổ hoặc buộc túi",
      "Áo bà ba lụa pastel cho chụp ảnh ngoài vườn",
    ],
    remixCareful: [
      "Khăn rằn có liên hệ với khăn krama của người Khmer Nam Bộ; khi dùng làm concept nên ghi nhận nguồn văn hóa",
    ],
    fabrics: ["Lãnh Mỹ A", "Lụa", "Vải bông", "Đũi"],
    sources: ["bt-dan-toc-hoc", "doan-thi-tinh"],
  },
  {
    id: "ao-nhat-binh",
    name: "Áo nhật bình",
    tagline: "Cổ bình lĩnh rộng phủ vai, trang phục cung đình Huế",
    era: "Triều Nguyễn, thế kỷ 19 – đầu 20",
    regions: ["trung"],
    summary:
      "Áo nhật bình là trang phục của nữ giới trong hoàng tộc và giới quý tộc triều Nguyễn, nổi bật với cổ áo rộng, phẳng, phủ xuống vai và ngực, tay áo rộng, thường thêu hoa văn tinh xảo.",
    origin: [
      { text: "Được dùng trong cung đình Huế thời Nguyễn, dành cho công chúa, cung phi và mệnh phụ.", confidence: "tu-lieu" },
      { text: "Được phục dựng và giới thiệu lại qua các lễ hội Festival Huế và các dự án phục dựng cổ phục.", confidence: "tu-lieu" },
    ],
    meaning: [
      { text: "Hoa văn và màu sắc từng thể hiện thứ bậc trong cung đình.", confidence: "tu-lieu" },
      { text: "Họa tiết phượng thường gắn với nữ giới hoàng tộc; rồng năm móng dành cho vua.", confidence: "tu-lieu" },
    ],
    anatomy: [
      { part: "Cổ bình lĩnh", desc: "Cổ áo lớn, phẳng, phủ vai, xẻ trước ngực." },
      { part: "Viền cổ", desc: "Thường bằng màu tương phản, thêu hoa văn." },
      { part: "Tay áo", desc: "Tay rộng, có thể đắp viền." },
      { part: "Thân áo", desc: "Dài quá gối, mặc ngoài áo dài hoặc áo lót." },
    ],
    traditionalWith: ["Khăn vấn", "Áo dài bên trong", "Quần lụa", "Giày hài thêu"],
    remixOk: [
      "Chọn hoa văn hoa lá, mây thay cho phượng khi chụp concept đời thường",
      "Dùng áo nhật bình trơn màu nhạt làm lớp khoác cho sự kiện văn hóa ở trường",
    ],
    remixCareful: [
      "Đây là lễ phục cung đình; phối với đồ thể thao hoặc mặc đi chơi thường ngày dễ làm nhẹ đi ý nghĩa",
      "Kết hợp vàng hoàng bào với rồng dễ bị hiểu là mô phỏng trang phục của vua",
    ],
    fabrics: ["Gấm", "Satin lụa", "Đoạn"],
    sources: ["hue-heritage", "ngan-nam-ao-mu"],
  },
  {
    id: "ao-tac",
    name: "Áo tấc",
    tagline: "Áo ngũ thân tay thụng, dùng làm lễ phục",
    era: "Thời Nguyễn đến đầu thế kỷ 20, nay dùng trong lễ nghi",
    regions: "ca-nuoc",
    summary:
      "Áo tấc có cấu trúc của áo ngũ thân nhưng tay áo rộng và dài, thân áo dài tới gần mắt cá. Đây là lễ phục, thường thấy trong cưới hỏi, tế lễ ở đình làng và các nghi thức trang trọng.",
    origin: [
      { text: "Là lễ phục phổ biến thời Nguyễn, mặc trong nghi lễ, cưới hỏi, cúng tế.", confidence: "tu-lieu" },
      { text: "Nguồn gốc tên gọi 'tấc' chưa thống nhất.", confidence: "gia-thuyet" },
    ],
    meaning: [
      { text: "Tay áo rộng thể hiện sự trang nghiêm, chậm rãi trong nghi lễ.", confidence: "dan-gian" },
    ],
    anatomy: [
      { part: "Tay thụng", desc: "Tay áo rộng, buông dài." },
      { part: "Thân dài", desc: "Dài tới gần mắt cá chân." },
      { part: "Cổ đứng, khuy chéo", desc: "Như áo ngũ thân." },
    ],
    traditionalWith: ["Khăn đóng hoặc khăn vấn", "Quần trắng", "Giày hài hoặc guốc"],
    remixOk: ["Dùng trong lễ cưới theo phong cách cổ phục", "Chụp ảnh gia đình ngày Tết"],
    remixCareful: [
      "Là lễ phục, không phù hợp để phối với sneaker, quần jeans trong nghi lễ",
      "Mặc đi chơi thường ngày có thể trông giống trang phục diễn",
    ],
    fabrics: ["Gấm", "Đoạn", "Lụa"],
    sources: ["ngan-nam-ao-mu", "doan-thi-tinh"],
  },
];

export const garmentById = (id: GarmentId) => GARMENTS.find((g) => g.id === id)!;

/* ------------------------------------------------------------------ */
/* Sự kiện                                                              */
/* ------------------------------------------------------------------ */

export type EventId =
  | "tet"
  | "ky-yeu"
  | "dam-cuoi"
  | "di-chua"
  | "le-hoi"
  | "su-kien-truong"
  | "dao-pho"
  | "trung-thu";

export type EventInfo = {
  id: EventId;
  name: string;
  formality: 1 | 2 | 3; // 1 thoải mái, 3 trang trọng
  maxRemix: 0 | 1 | 2;
  recommended: GarmentId[];
  avoid: { garment: GarmentId; reason: string }[];
  goodColors: ColorId[];
  carefulColors: { color: ColorId; reason: string }[];
  tip: string;
};

export const EVENTS: EventInfo[] = [
  {
    id: "tet",
    name: "Tết Nguyên Đán",
    formality: 2,
    maxRemix: 1,
    recommended: ["ao-dai", "ao-ngu-than", "ao-tac"],
    avoid: [],
    goodColors: ["do-son", "vang-hoa-hoe", "hong-dao", "xanh-ngoc"],
    carefulColors: [
      { color: "den-lanh", reason: "Nhiều gia đình kiêng mặc toàn đen ngày đầu năm vì gợi không khí tang." },
      { color: "trang-nga", reason: "Toàn trắng kèm khăn trắng quấn đầu dễ gợi trang phục tang." },
    ],
    tip: "Màu đỏ, vàng, hồng gợi may mắn đầu năm. Áo ngũ thân và khăn vấn đang là lựa chọn được nhiều bạn trẻ yêu thích khi đi chúc Tết.",
  },
  {
    id: "ky-yeu",
    name: "Kỷ yếu, tốt nghiệp",
    formality: 2,
    maxRemix: 2,
    recommended: ["ao-dai", "ao-ngu-than", "ao-ba-ba", "ao-tu-than"],
    avoid: [],
    goodColors: ["trang-nga", "xanh-lam", "hong-dao", "tim-hue"],
    carefulColors: [],
    tip: "Nhóm bạn có thể chọn cùng kiểu áo nhưng khác màu để ảnh tập thể hài hòa. Remix được, miễn các chi tiết đặc trưng còn nguyên.",
  },
  {
    id: "dam-cuoi",
    name: "Làm khách đám cưới",
    formality: 3,
    maxRemix: 1,
    recommended: ["ao-dai", "ao-ngu-than"],
    avoid: [{ garment: "ao-tu-than", reason: "Trang phục lễ hội dân gian, dễ lạc lõng trong tiệc cưới hiện đại." }],
    goodColors: ["hong-dao", "xanh-ngoc", "xanh-lam", "tim-hue"],
    carefulColors: [
      { color: "do-son", reason: "Áo dài đỏ thường là màu của cô dâu; khách mời nên tránh để không trùng." },
      { color: "den-lanh", reason: "Toàn đen thường bị xem là không hợp không khí vui." },
      { color: "trang-nga", reason: "Toàn trắng dễ trùng cô dâu hoặc gợi màu tang." },
    ],
    tip: "Khách mời nên tránh đỏ rực và khăn mấn để không trùng cô dâu. Tông pastel hoặc xanh ngọc vừa lịch sự vừa nổi bật.",
  },
  {
    id: "di-chua",
    name: "Đi chùa, lễ đầu năm",
    formality: 3,
    maxRemix: 0,
    recommended: ["ao-dai", "ao-ngu-than", "ao-ba-ba"],
    avoid: [
      { garment: "ao-nhat-binh", reason: "Lễ phục cung đình rất nổi bật, không hợp không gian tu tập giản dị." },
    ],
    goodColors: ["nau-non", "trang-nga", "xam-tro", "xanh-hoa-ly"],
    carefulColors: [{ color: "do-son", reason: "Đỏ quá rực có thể gây chú ý ở nơi cần sự tĩnh lặng." }],
    tip: "Ưu tiên kín đáo, màu nhã, giày dễ tháo khi vào chánh điện. Hạn chế phụ kiện ồn ào và kính râm trong điện thờ.",
  },
  {
    id: "le-hoi",
    name: "Lễ hội dân gian",
    formality: 2,
    maxRemix: 1,
    recommended: ["ao-tu-than", "ao-ba-ba", "ao-ngu-than"],
    avoid: [],
    goodColors: ["nau-non", "xanh-hoa-ly", "hong-dao", "cham"],
    carefulColors: [],
    tip: "Hội Lim, hội làng là dịp đẹp nhất cho áo tứ thân, nón quai thao, thắt lưng hoa lý. Ở Nam Bộ, bà ba và khăn rằn là lựa chọn gần gũi.",
  },
  {
    id: "su-kien-truong",
    name: "Sự kiện văn hóa ở trường",
    formality: 2,
    maxRemix: 2,
    recommended: ["ao-dai", "ao-tu-than", "ao-ngu-than", "ao-ba-ba", "ao-nhat-binh"],
    avoid: [],
    goodColors: ["xanh-lam", "do-son", "vang-hoa-hoe", "trang-nga"],
    carefulColors: [],
    tip: "Hãy chuẩn bị một câu giới thiệu ngắn về trang phục mình mặc. Remix sáng tạo được khuyến khích nếu bạn giải thích được ý tưởng.",
  },
  {
    id: "dao-pho",
    name: "Dạo phố, chụp ảnh phố cổ",
    formality: 1,
    maxRemix: 2,
    recommended: ["ao-dai", "ao-ba-ba", "ao-ngu-than"],
    avoid: [{ garment: "ao-tac", reason: "Lễ phục tay thụng dễ trông như đồ diễn khi đi dạo thường ngày." }],
    goodColors: ["vang-hoa-hoe", "xanh-ngoc", "hong-sen", "trang-nga"],
    carefulColors: [],
    tip: "Hội An hợp màu vàng, xanh ngọc; Huế hợp tím và trắng; Hà Nội mùa thu hợp nâu, be. Đây là dịp thoải mái nhất để remix.",
  },
  {
    id: "trung-thu",
    name: "Trung thu",
    formality: 1,
    maxRemix: 2,
    recommended: ["ao-ba-ba", "ao-tu-than", "ao-dai", "ao-ngu-than"],
    avoid: [],
    goodColors: ["do-son", "vang-hoa-hoe", "xanh-hoa-ly", "hong-sen"],
    carefulColors: [],
    tip: "Màu tươi ấm hợp với đèn lồng. Tránh vạt áo quá dài nếu phải cầm đèn, rước đèn.",
  },
];

export const eventById = (id: EventId) => EVENTS.find((e) => e.id === id)!;

/* ------------------------------------------------------------------ */
/* Màu sắc                                                              */
/* ------------------------------------------------------------------ */

export type ColorId =
  | "do-son"
  | "hong-dao"
  | "hong-sen"
  | "vang-hoa-hoe"
  | "xanh-hoa-ly"
  | "xanh-ngoc"
  | "xanh-lam"
  | "cham"
  | "tim-hue"
  | "nau-non"
  | "den-lanh"
  | "trang-nga"
  | "xam-tro";

export type ColorInfo = { id: ColorId; name: string; hex: string; meaning: string };

export const COLORS: ColorInfo[] = [
  { id: "do-son", name: "Đỏ son", hex: "#B3261E", meaning: "Màu may mắn, gắn với Tết và cưới hỏi." },
  { id: "hong-dao", name: "Hồng đào", hex: "#E58A8F", meaning: "Màu hoa đào ngày xuân miền Bắc, trẻ trung, dịu." },
  { id: "hong-sen", name: "Hồng cánh sen", hex: "#C8437A", meaning: "Tươi, nổi bật, gợi hoa sen mùa hạ." },
  { id: "vang-hoa-hoe", name: "Vàng hoa hòe", hex: "#E0A526", meaning: "Màu nhuộm từ hoa hòe, dùng trong tranh Đông Hồ. Vàng thẫm từng là màu dành cho vua triều Nguyễn." },
  { id: "xanh-hoa-ly", name: "Xanh hoa lý", hex: "#7FAE6B", meaning: "Màu thắt lưng quen thuộc của áo tứ thân." },
  { id: "xanh-ngoc", name: "Xanh ngọc", hex: "#23877D", meaning: "Tươi mát, hợp phố Hội An và tiệc cưới." },
  { id: "xanh-lam", name: "Xanh lam", hex: "#3563A8", meaning: "Trầm tĩnh, thanh lịch, hợp sự kiện trang trọng." },
  { id: "cham", name: "Xanh chàm", hex: "#23305C", meaning: "Màu nhuộm lá chàm, bền màu, gần gũi đời sống lao động." },
  { id: "tim-hue", name: "Tím Huế", hex: "#5E2E73", meaning: "Gắn với Huế, gợi sự dịu dàng, thủy chung." },
  { id: "nau-non", name: "Nâu non", hex: "#8A5A3B", meaning: "Màu nhuộm củ nâu của áo tứ thân thường ngày, mộc mạc." },
  { id: "den-lanh", name: "Đen lãnh", hex: "#1D1B22", meaning: "Màu lãnh Mỹ A Tân Châu, bóng và sang." },
  { id: "trang-nga", name: "Trắng ngà", hex: "#F1ECE2", meaning: "Tinh khôi, áo dài nữ sinh. Toàn trắng kèm khăn trắng có thể gợi tang lễ." },
  { id: "xam-tro", name: "Xám tro", hex: "#8E8C86", meaning: "Trung tính, nhã nhặn, hợp không gian chùa chiền." },
];

export const colorById = (id: ColorId) => COLORS.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ */
/* Hoa văn                                                              */
/* ------------------------------------------------------------------ */

export type PatternId = "tron" | "hoa-sen" | "hoa-mai" | "may-hac" | "phuong" | "rong" | "trong-dong" | "ke-ran" | "tho-cam";

export const PATTERNS: { id: PatternId; name: string; meaning: string; note?: string }[] = [
  { id: "tron", name: "Trơn", meaning: "Tối giản, dễ phối, hợp mọi dịp." },
  { id: "hoa-sen", name: "Hoa sen", meaning: "Thanh khiết, gắn với Phật giáo và được xem là quốc hoa không chính thức." },
  { id: "hoa-mai", name: "Mai, đào", meaning: "Mùa xuân, sự khởi đầu may mắn." },
  { id: "may-hac", name: "Mây, hạc", meaning: "Trường thọ, thanh cao." },
  { id: "phuong", name: "Phượng", meaning: "Biểu tượng cao quý, gắn với nữ giới trong cung đình." },
  { id: "rong", name: "Rồng", meaning: "Quyền uy. Rồng năm móng từng dành riêng cho vua.", note: "Cân nhắc khi dùng làm trang phục thường ngày." },
  { id: "trong-dong", name: "Trống đồng", meaning: "Họa tiết mặt trời, chim Lạc từ văn hóa Đông Sơn.", note: "Họa tiết mang tính biểu tượng quốc gia, nên dùng trang trọng." },
  { id: "ke-ran", name: "Kẻ rằn", meaning: "Họa tiết ca rô của khăn rằn Nam Bộ." },
  { id: "tho-cam", name: "Thổ cẩm", meaning: "Họa tiết dệt của các dân tộc thiểu số.", note: "Mỗi dân tộc có hoa văn riêng; nên ghi rõ nguồn và tránh hoa văn mang ý nghĩa tín ngưỡng." },
];

/* ------------------------------------------------------------------ */
/* Phụ kiện & phong cách                                                */
/* ------------------------------------------------------------------ */

export type HeadId = "none" | "non-la" | "quai-thao" | "khan-van" | "khan-dong" | "mo-qua" | "khan-man";
export type FeetId = "guoc-moc" | "giay-hai" | "cao-got" | "sneaker" | "sandal";
export type BottomId = "quan-lua" | "vay-dai" | "jeans" | "chan-vay-midi";
export type OuterId = "none" | "blazer" | "denim" | "cardigan";
export type ExtraId = "khan-ran" | "kieng-bac" | "tui-tote" | "tui-gam" | "kinh-ram" | "tram-cai" | "that-lung";
export type LengthId = "dai" | "qua-goi" | "ngan";
export type FabricId = "lua" | "gam" | "dui" | "voan" | "nhung";

type Item<T extends string> = { id: T; name: string; info: string; regions?: RegionId[]; modern?: boolean };

export const HEADS: Item<HeadId>[] = [
  { id: "none", name: "Không", info: "Để tóc tự nhiên." },
  { id: "non-la", name: "Nón lá", info: "Phổ biến cả ba miền. Nón bài thơ Huế có hình và thơ lồng giữa hai lớp lá." },
  { id: "quai-thao", name: "Nón quai thao", info: "Nón mặt phẳng, vành rộng, quai tua rua. Gắn với lễ hội và quan họ vùng Kinh Bắc.", regions: ["bac"] },
  { id: "khan-van", name: "Khăn vấn", info: "Khăn quấn tròn quanh đầu của phụ nữ, mặc cùng áo ngũ thân, áo dài." },
  { id: "khan-dong", name: "Khăn đóng", info: "Khăn xếp sẵn thành vành, thường của nam giới khi mặc áo ngũ thân, áo tấc." },
  { id: "mo-qua", name: "Khăn mỏ quạ", info: "Khăn vuông gấp chéo, mũi khăn nhọn trên trán như mỏ quạ. Đi cùng áo tứ thân.", regions: ["bac"] },
  { id: "khan-man", name: "Khăn mấn", info: "Khăn vành lớn, ngày nay thường là phụ kiện của cô dâu mặc áo dài cưới." },
];

export const FEET: Item<FeetId>[] = [
  { id: "guoc-moc", name: "Guốc mộc", info: "Guốc gỗ quai ngang, truyền thống, trơn khi trời mưa." },
  { id: "giay-hai", name: "Giày hài", info: "Giày vải thêu mũi cong, đi cùng lễ phục." },
  { id: "cao-got", name: "Giày cao gót", info: "Phổ biến với áo dài hiện đại." },
  { id: "sneaker", name: "Sneaker trắng", info: "Remix đường phố, thoải mái khi đi nhiều.", modern: true },
  { id: "sandal", name: "Sandal", info: "Thoáng, hợp trời nóng hoặc mưa.", modern: true },
];

export const BOTTOMS: Item<BottomId>[] = [
  { id: "quan-lua", name: "Quần lụa ống rộng", info: "Quần truyền thống đi cùng áo dài, áo ngũ thân, bà ba." },
  { id: "vay-dai", name: "Váy dài sẫm màu", info: "Váy truyền thống đi cùng áo tứ thân." },
  { id: "jeans", name: "Quần jeans ống suông", info: "Remix đường phố.", modern: true },
  { id: "chan-vay-midi", name: "Chân váy midi", info: "Remix nữ tính, dài qua gối.", modern: true },
];

export const OUTERS: Item<OuterId>[] = [
  { id: "none", name: "Không khoác", info: "" },
  { id: "blazer", name: "Blazer", info: "Lịch sự, hợp sự kiện trường, trời se lạnh.", modern: true },
  { id: "denim", name: "Áo khoác denim", info: "Năng động, hợp dạo phố.", modern: true },
  { id: "cardigan", name: "Cardigan len", info: "Ấm, mềm, hợp mùa đông miền Bắc.", modern: true },
];

export const EXTRAS: Item<ExtraId>[] = [
  { id: "that-lung", name: "Thắt lưng lụa", info: "Dải lụa buộc eo, đuôi buông trước. Đặc trưng áo tứ thân." },
  { id: "khan-ran", name: "Khăn rằn", info: "Khăn ca rô Nam Bộ, có liên hệ với khăn krama của người Khmer.", regions: ["nam"] },
  { id: "kieng-bac", name: "Kiềng bạc", info: "Vòng cổ bạc, trang sức truyền thống." },
  { id: "tram-cai", name: "Trâm cài tóc", info: "Trâm gỗ hoặc bạc cài búi tóc." },
  { id: "tui-gam", name: "Túi gấm", info: "Túi nhỏ bằng gấm, hợp dịp Tết, lễ." },
  { id: "tui-tote", name: "Túi tote vải", info: "Remix thường ngày.", modern: true },
  { id: "kinh-ram", name: "Kính râm", info: "Remix đường phố. Nên tháo khi vào nơi thờ tự.", modern: true },
];

export const LENGTHS: { id: LengthId; name: string; info: string }[] = [
  { id: "dai", name: "Tà dài", info: "Chấm mắt cá, dáng truyền thống." },
  { id: "qua-goi", name: "Tà qua gối", info: "Áo dài cách tân, gọn gàng." },
  { id: "ngan", name: "Tà ngắn ngang hông", info: "Mất đặc điểm tà dài, chỉ còn là áo lấy cảm hứng." },
];

export const FABRICS: { id: FabricId; name: string; info: string; warm: number }[] = [
  { id: "voan", name: "Voan", info: "Mỏng nhẹ, bay, hợp trời nóng.", warm: 0 },
  { id: "lua", name: "Lụa", info: "Mềm, mát, bóng nhẹ.", warm: 1 },
  { id: "dui", name: "Đũi", info: "Thô nhẹ, thấm hút, hợp dạo phố.", warm: 1 },
  { id: "gam", name: "Gấm", info: "Dày, dệt hoa văn, sang trọng, hợp Tết và lễ.", warm: 2 },
  { id: "nhung", name: "Nhung", info: "Ấm, mịn, hợp mùa lạnh.", warm: 3 },
];

export type StyleId = "chuan" | "thanh-lich" | "co-phong" | "retro" | "street";

export const STYLES: { id: StyleId; name: string; remix: 0 | 1 | 2; desc: string }[] = [
  { id: "chuan", name: "Chuẩn truyền thống", remix: 0, desc: "Giữ trọn cấu trúc và cách phối xưa." },
  { id: "thanh-lich", name: "Thanh lịch tối giản", remix: 1, desc: "Màu trơn, ít phụ kiện, đường nét gọn." },
  { id: "co-phong", name: "Cổ phong", remix: 1, desc: "Gấm, hoa văn cát tường, khăn vấn, trâm cài." },
  { id: "retro", name: "Retro Sài Gòn", remix: 1, desc: "Tinh thần áo dài thập niên 60–70, kính râm, túi nhỏ." },
  { id: "street", name: "Streetwear remix", remix: 2, desc: "Sneaker, jeans, áo khoác, giữ nguyên áo truyền thống làm trung tâm." },
];

export const REMIX_LABEL = ["Truyền thống", "Remix nhẹ", "Remix mạnh"] as const;

/* ------------------------------------------------------------------ */
/* Hỗ trợ lấy tên nhanh                                                 */
/* ------------------------------------------------------------------ */

const byId = <T extends { id: string; name: string }>(list: T[], id: string) =>
  list.find((x) => x.id === id)?.name ?? id;

export const names = {
  head: (id: HeadId) => byId(HEADS, id),
  feet: (id: FeetId) => byId(FEET, id),
  bottom: (id: BottomId) => byId(BOTTOMS, id),
  outer: (id: OuterId) => byId(OUTERS, id),
  extra: (id: ExtraId) => byId(EXTRAS, id),
  pattern: (id: PatternId) => byId(PATTERNS, id),
  fabric: (id: FabricId) => byId(FABRICS, id),
  style: (id: StyleId) => byId(STYLES, id),
  length: (id: LengthId) => byId(LENGTHS, id),
  region: (id: RegionId) => byId(REGIONS, id),
};
