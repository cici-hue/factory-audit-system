// Static translation map for module names, sub-module names and item names
// Maps Chinese names to English equivalents for use in the UI

export const moduleNameTranslations: { [key: string]: string } = {
  // ============ Light Woven Module Names ============
  '纸样、样衣制作': 'Pattern & Sample Making',
  '面辅料品质控制': 'Fabric & Trim Quality Control',
  '产前会议控制': 'Pre-production Meeting Control',
  '裁剪品质控制': 'Cutting Quality Control',
  '缝制工艺品质控制': 'Sewing Quality Control',
  '后道品质控制': 'Finishing Quality Control',
  '质量部门品质控制': 'Quality Department Control',
  '其他评分': 'Other Scoring',

  // ============ Lingerie/Swimwear Module Names ============
  '面料检验': 'Fabric Inspection',
  '裁剪': 'Cutting',
  '缝制': 'Sewing',
  '后整理': 'Finishing',
  '包装': 'Packaging',
  '面辅料仓库': 'Fabric & Trim Warehouse',
  '纸样,样衣制作': 'Pattern & Sample Making',

  // ============ Flat Knit Module Names ============
  '首件检查': 'First Article Inspection',
  '缝盘套口控制': 'Linking Control',
  '手缝控制': 'Hand Sewing Control',
  '水洗烘干': 'Washing & Drying',
  '烫衣控制': 'Ironing Control',
  '钮扣挂牌控制': 'Button & Tag Control',
  '查衫控制': 'Final Inspection Control',
  '原料检验控制（10分）': 'Raw Material Inspection Control (10 pts)',
  '工艺制版控制（7.5分）': 'Process Design Control (7.5 pts)',
  '产前会议控制（10分）': 'Pre-production Meeting Control (10 pts)',
  '织片检验控制（10分）': 'Knitted Panel Inspection Control (10 pts)',
  '缝盘套口控制（10分）': 'Linking Control (10 pts)',
  '水洗 & 烘干控制（10分）': 'Washing & Drying Control (10 pts)',
  '锁眼、钉扣、钉标 & 打结控制（5分）': 'Buttonhole, Button, Tag & Knotting Control (5 pts)',
  '整烫控制（10分）': 'Ironing Control (10 pts)',
  '检验控制（15分）': 'Inspection Control (15 pts)',
  '包装控制（12.5分）': 'Packaging Control (12.5 pts)',
};

// Sub-module name translations
export const subModuleNameTranslations: { [key: string]: string } = {
  // Pattern & Sample Making
  '1. 纸样开发标准': '1. Pattern Development Standards',
  '2. 版本控制与追溯性': '2. Version Control & Traceability',
  '3. 初版审核与文档化': '3. Initial Review & Documentation',
  '4. 样衣制作与审批': '4. Sample Making & Approval',

  // Fabric & Trim Quality Control
  '1. 面料仓库检查': '1. Fabric Warehouse Inspection',
  '2. 面料入库记录': '2. Fabric Incoming Records',
  '3. 面料检验（织成试样检验）': '3. Fabric Inspection (Greige Sample)',
  '4. 面料测试': '4. Fabric Testing',
  '5. 预缩记录和结果': '5. Pre-shrinkage Records & Results',
  '6. 面料出库记录及盘点记录': '6. Fabric Outgoing & Inventory Records',
  '7. 辅料仓库检查': '7. Trim Warehouse Inspection',
  '8. 辅料检验': '8. Trim Inspection',
  '9. 辅料测试': '9. Trim Testing',
  '10. 辅料出库记录及盘点记录': '10. Trim Outgoing & Inventory Records',

  // Pre-production Meeting
  '1. 参会人员': '1. Participants',
  '2. 工艺标准传达及预防措施': '2. Process Standards & Prevention',
  '3. 技术难点分析': '3. Technical Difficulty Analysis',
  '4. 会议记录执行': '4. Meeting Record Execution',

  // Cutting Quality Control
  '1. 面料松布': '1. Fabric Relaxation',
  '2. 待裁': '2. Ready to Cut',
  '3. 铺布': '3. Spreading',
  '4. 裁片': '4. Cut Pieces',
  '5. 粘衬': '5. Fusing',

  // Sewing Quality Control
  '1. 缝制设备/特种设备': '1. Sewing Equipment / Special Equipment',
  '2. 点位及小烫': '2. Marking & Under-pressing',
  '3. 缝制中': '3. During Sewing',
  '4. 线上检验': '4. In-line Inspection',
  '5. 唛头': '5. Labels',

  // Finishing Quality Control
  '1. 后道区域': '1. Finishing Area',
  '2. 锁眼钉扣': '2. Buttonhole & Button Sewing',
  '3. 整烫': '3. Pressing',
  '4. 总检': '4. Final Inspection',
  '5. 包装': '5. Packaging',
  '6. 装箱': '6. Carton Packing',
  '7. 尾查': '7. End Check',

  // Quality Department Control
  '1. 检验设备/特种设备': '1. Inspection Equipment / Special Equipment',
  '2. 内控标准及封样': '2. Internal Standards & Sealed Samples',
  '3. 抽样及检验': '3. Sampling & Inspection',
  '4. 记录及报告': '4. Records & Reports',
  '1. AQL抽检': '1. AQL Inspection',

  // Other Scoring
  '1. Dummy': '1. Dummy',
  '2. 利器管控': '2. Sharp Object Control',
  '3. 其他': '3. Others',

  // Flat Knit - Raw Material Inspection
  '1. 入库检查': '1. Incoming Inspection',
  '2. 纱线外观检验': '2. Yarn Appearance Inspection',
  '3. 纱线性能检验（织成试样检验）': '3. Yarn Performance Inspection (Greige Sample)',
  '4. 仓储管理': '4. Warehouse Management',
  '5. 络纱过蜡': '5. Winding & Waxing',

  // Flat Knit - Process Design
  '1. 小片织造与密度测算': '1. Sample Knitting & Density Measurement',
  '2. 全码工艺设计': '2. Full-size Process Design',
  '3. 程序执行': '3. Program Execution',
  '4. 克重、尺寸控制': '4. Weight & Size Control',

  // Flat Knit - Pre-production Meeting
  '1. 参会人员': '1. Participants',
  '2. 产前会资料、统一工艺标准': '2. Pre-production Materials & Standards',
  '3. 技术难点分析与预防措施制定': '3. Technical Analysis & Prevention',
  '4. 会议记录执行': '4. Meeting Record Execution',

  // Flat Knit - Fabric Inspection
  '1. 小片测试': '1. Sample Testing',
  '2. 生产测试频次': '2. Production Testing Frequency',
  '3. 横机车间质量管控': '3. Flat Knitting Workshop QC',
  '4. 颜色及多色衣片比对': '4. Color & Multi-color Comparison',
  '5. 专职织片检查': '5. Dedicated Panel Inspection',

  // Flat Knit - Linking
  '1. 工艺参数执行': '1. Process Parameters',
  '2. 缝线性能要求': '2. Thread Performance Requirements',
  '3. 缝合质量要求及检验': '3. Sewing Quality & Inspection',
  '4. 首件检查': '4. First Article Inspection',

  // Flat Knit - Washing & Drying
  '1. 首件测试及工艺制定': '1. First Article Testing & Process',
  '2. 过程控制': '2. Process Control',
  '3. 检查要点与效果比对': '3. Inspection & Comparison',

  // Flat Knit - Button & Tag
  '1. 锁眼、钉扣及标牌准确性': '1. Buttonhole/Button/Tag Accuracy',
  '2. 锁眼、钉扣及打结标准': '2. Buttonhole/Button/Knotting Standards',
  '3. 牢固度测试': '3. Fastness Testing',

  // Flat Knit - Ironing
  '1. 工艺制定': '1. Process Setting',
  '2. 烫版管理': '2. Ironing Template Management',
  '3. 外观质量': '3. Appearance Quality',
  '4. 尺寸控制及操作规范': '4. Size Control & Operation Standards',
  '5. 质量抽查': '5. Quality Spot Check',

  // Flat Knit - Inspection
  '1. 检验培训及检验流程制定': '1. Inspection Training & Process',
  '2. 检验环境': '2. Inspection Environment',
  '3. 100%检验': '3. 100% Inspection',
  '4. 疵点分析及不合格品管理': '4. Defect Analysis & Non-conforming Management',
  '5. 包装前抽检': '5. Pre-package Spot Check',
  '6. 质量总结': '6. Quality Summary',

  // Flat Knit - Packaging
  '1. 包装测试': '1. Packaging Testing',
  '2. 包装培训及标准管理': '2. Packaging Training & Standards',
  '3. 分袋管理': '3. Bag Separation Management',
  '4. 辅料标签管理': '4. Trim & Label Management',
  '5. 验针管理': '5. Needle Inspection Management',
  '6. 巡检制度': '6. Patrol Inspection',
};

// Item name translations (for flat knit and special items)
export const itemNameTranslations: { [key: string]: string } = {
  // Special items
  '无首件样': 'No First Article Sample',
  '花色超标': 'Color Exceeded Standard',
  '未织小片': 'No Sample Knitted',

  // Common numbered items - light woven
  '① 使用CAD软件制作/修改纸样': '① Use CAD software to create/modify patterns',
  '② 缝份清晰标记应合规': '② Seam allowance clearly marked and compliant',
  '③ 布纹线，剪口标注合规并清晰': '③ Grain line and notches marked compliant and clear',
  '④ 放码标准（尺寸增量）遵守客户要求，并文档化': '④ Grading standard follows customer requirements and is documented',
  '⑤ 技术包（Tech Pack）应明确标注尺寸表、工艺说明与要求，及特殊工艺说明（尤其是特殊面料或设计）': '⑤ Tech pack must clearly specify size chart, process requirements, and special process notes',

  // Fabric & Trim Quality Control
  '① 合格/不合格品/待检标识应明确，分开堆放': '① Pass/Fail/Pending labels clear, separate stacking',
  '② 面料不可"井"字堆放，高度不可过高（建议<1.5m）（针织面料除外）': '② No cross-stacking, height limit (knit fabric excluded)',
  '③ 不同颜色及批次（缸号）分开堆放': '③ Different colors and batches stacked separately',
  '④ 托盘存放不靠墙、不靠窗、避光储存及防潮防霉': '④ Pallet storage away from walls/windows, light/moisture-proof',
  '⑤ 温湿度计及记录（湿度<65%）': '⑤ Thermohygrometer and records (humidity <65%)',
  '① 面料厂验布记录/测试记录/缸差布': '① Mill inspection/testing records/lot shade cloth',
  '② 入库单（卷数，米数，克重等）': '② Incoming list (rolls, meters, weight, etc.)',
  '① 四分制验布及现场演示': '① 4-point system inspection and on-site demo',
  '② 500m以下全检，500m以上至少抽检10%（覆盖每缸）': '② 100% for <500m, ≥10% sampling for >500m (per lot)',
  '③ 核对面料厂缸差布和大货面料（颜色D65，克重，防静电）': '③ Verify mill shade cloth vs bulk (D65 color, weight, anti-static)',
  '① 每缸测试记录（如水洗色牢度，干湿色牢度，PH值）': '① Per-lot test records (wash fastness, etc.)',
  '① 面料缩率要求 ≤ 3%（水洗针织款除外）': '① Shrinkage requirement ≤ 3% (washable knit excluded)',
  '② 每缸缩率记录': '② Shrinkage record per lot',
  '① 出库记录含款号，缸号，米数，色号，时间，领料人等信息': '① Outgoing records with style/lot/meter/color/time/picker info',
  '② 盘点记录': '② Stocktaking records',
  '③ 库存1年以上面料不可使用': '③ No fabric stored over 1 year',
  '① 辅料存放标识明确（订单/款号/色号，分类堆放）': '① Trim labels clear (order/style/color, classified)',
  '② 辅料入库记录（品类，数量）': '② Trim incoming records (category, quantity)',
  '① 正确辅料卡核对（型号，颜色，功能，内容，外观）': '① Verify correct trim card (model, color, function, content, appearance)',
  '① 织带，橡筋，拉链，绳子的预缩测试（水洗缩，烫蒸缩）': '① Pre-shrink test for tape, elastic, zipper, cord',
  '① 出库记录含款号，数量，色号，时间，领料人等信息': '① Outgoing records with style/qty/color/time/picker info',
  '③ 库存记录（保留至少1年）': '③ Inventory records (keep ≥1 year)',

  // Pre-production Meeting
  '① 技术部': '① Technical Dept',
  '② 质检部': '② QC Dept',
  '③ 业务部': '③ Sales Dept',
  '④ 生产部（裁剪，生产主管，生产组长）': '④ Production Dept (cutting, supervisor, group leader)',
  '⑤ 后道（后道主管）': '⑤ Finishing (supervisor)',
  '⑥ 二次加工产品（印花/绣花/水洗/烫钻等）各工序负责人必须参会': '⑥ Secondary processing reps must attend',
  '① 客户确认样': '① Customer-approved sample',
  '② 确认意见，明确客户要求': '② Confirmation notes, clear customer requirements',
  '③ 试生产样（客户确认码，最小码及最大码）和封样': '③ Trial samples (customer approved size, smallest & largest) and sealed samples',
  '④ 工艺单需覆盖以下内容 a. 重点工序难点（制作领子，门襟等小样）及解决方案': '④ Process sheet a. key process difficulties and solutions',
  '⑤ 工艺单需覆盖以下内容 b. 试生产样的外观/尺寸/克重/试身的问题及解决方案': '⑤ Process sheet b. trial sample issues and solutions',
  '⑥ 工艺单需覆盖以下内容 c. 对条对格，花型定位等要求': '⑥ Process sheet c. pattern matching, positioning',
  '⑦ 工艺单需覆盖以下内容 d. 特别关注撕裂强度的缝制工艺的风险': '⑦ Process sheet d. tear strength sewing risks',
  '⑧ 工艺单需覆盖以下内容 e. 特别关注粘衬环节的风险（颜色差异，透胶，粘衬颜色）': '⑧ Process sheet e. fusing risks (color, glue, fusing color)',
  '⑨ 工艺单需覆盖以下内容 f. 轻薄产品包装方法风险评估（皱，滑落等）': '⑨ Process sheet f. lightweight packaging risk assessment',
  '① 提出相应的改进建议': '① Propose improvement suggestions',
  '② 明确跟进人员及负责人': '② Clarify follow-up personnel',
  '① 会议记录完整，参会人员签字确认': '① Complete meeting records, signed by attendees',
  '② 会议记录随工艺单确认样一起流转至生产各部门': '② Meeting records flow to all production depts with process sheets',

  // Cutting Quality Control
  '① 面料不可捆扎': '① No bundling fabric',
  '② 面料不可多卷混放': '② No mixing multiple rolls',
  '③ 面料不可落地摆放': '③ No ground placement',
  '④ 现场标识清晰（订单号，缸号/卷号，开始及结束时间）': '④ Clear on-site labels (order/lot/roll, start/end time)',
  '① 复核面料测试报告，松布时效': '① Re-verify fabric test report, relaxation time',
  '② 裁剪计划单及签字': '② Cutting plan and signature',
  '③ 唛架的核对（是否缺失，对码）': '③ Marker verification (missing, size match)',
  '① 确认铺布方式（单向/双向/定位），确保一件一方向': '① Confirm spreading method (one-way/two-way/positioning)',
  '② 要求面料平整，无褶皱，无拉伸变形，无纬斜，且布边对齐': '② Fabric flat, no wrinkles/stretch/skew, selvedge aligned',
  '③ 铺布层数（50-80层）薄料高度<5cm，其他面料最高不能超过12cm（自动裁床根据裁床限定高度）': '③ Layer count (50-80), thin <5cm, others ≤12cm',
  '④ 每卷面料需要用隔层纸或面料隔开': '④ Each roll separated by paper or fabric',
  '⑤ 弹力面料铺布后须静置2小时': '⑤ Stretch fabric must rest 2hrs after spreading',
  '⑥ 铺布完成后用夹子四周固定，中间用重物压实（自动裁床除外）': '⑥ Use clips and weights after spreading (auto cutter excluded)',
  '⑦ 剩余面料布头需标识清晰以备换片': '⑦ Remaining fabric ends clearly labeled for replacement',
  '① 裁片大小的复核（上中下各3片）': '① Cut piece size re-check (top/middle/bottom 3 each)',
  '② 验片外观（布疵，勾丝，污渍，印花等）': '② Piece appearance (defects, snags, stains, prints)',
  '③ 编号': '③ Numbering',
  '④ 用捆扎绳卷筒式捆扎（捆扎绳有裁片信息：款号，分包号，件数，缸号，尺码等）': '④ Roll-up bundling (with style/sub-bundle/qty/lot/size info)',
  '⑤ 分码分色存放（浅色需覆盖分开放置），禁止落地': '⑤ Separate by size/color (light colors covered), no ground placement',
  '① 粘衬机清洁和机器维护': '① Fusing machine cleaning and maintenance',
  '② 粘衬机参数（衬厂提供）和工艺单吻合': '② Fusing parameters match process sheet',
  '③ 粘衬丝缕方向同面料丝缕方向': '③ Fusing grain aligns with fabric grain',
  '④ 入粘衬机时按丝缕方向送入': '④ Feed in grain direction',
  '⑤ 首批粘衬的裁片，需做剥离测试，是否透胶等评估风险（如有问题，立即会报裁剪主管跟进解决）': '⑤ First batch fusing needs peel test, report issues to cutting supervisor',

  // Sewing Quality Control
  '① 定期维护保养记录': '① Regular maintenance records',
  '② 压脚类型与面料是否匹配': '② Presser foot type matches fabric',
  '③ 针距/针型号是否匹配': '③ Stitch length/needle size match',
  '④ 缝纫线硅油用量及线迹张力核查（线迹平整度等）': '④ Sewing thread silicone dosage and tension check',
  '① 点位工序要点 a. 禁止使用高温消色笔': '① Marking a. No high-temp disappearing pen',
  '② 点位工序要点 b. 核查丝缕方向是否与纸样标注的方向一致': '② Marking b. Verify grain matches pattern',
  '③ 点位工序要点 c. 点位前确保裁片和纸样吻合，避免偏移': '③ Marking c. Pieces match pattern before marking',
  '④ 小烫工序要点 a. 烫台用白布包裹及台面干净整洁，定期更换': '④ Under-pressing a. Ironing board covered with white cloth',
  '⑤ 小烫工序要点 b.烫斗温度和面料匹配（建议真丝面料低于110度）': '⑤ Under-pressing b. Iron temp matches fabric (silk <110℃)',
  '⑥ 小烫工序要点 c.烫工的操作手法是否正确（见指南）': '⑥ Under-pressing c. Correct operation method',
  '⑦ 查验 a. 查验是否有激光印/透胶': '⑦ Check a. Laser marks/glue penetration',
  '⑧ 查验 b. 查验是否变型/变色': '⑧ Check b. Deformation/discoloration',
  '⑨ 查验 c. 查验粘衬牢固度': '⑨ Check c. Fusing bond strength',
  '① 重点工序悬挂指示牌及标准小样（领子，口袋，门襟，袖口等）': '① Key process signs and standard samples displayed',
  '② 重点工序是否有辅助工具提高质量稳定性（压脚，鱼骨，模版等）': '② Key process auxiliary tools for quality',
  '③ 现场是否有首件样及资料（工艺单，辅料卡，产前会议记录等）': '③ First article sample and docs on-site',
  '④ 线上车工技能评估（半成品的质量-皱/对称等）': '④ Line operator skill assessment (WIP quality)',
  '⑤ 巡检是否定时巡查重点工序质量': '⑤ Patrol inspection of key processes',
  '⑥ 线头是否随做随剪': '⑥ Trim threads as you go',
  '⑦ 半成品不可捆扎过紧，避免褶皱': '⑦ No tight WIP bundling, avoid wrinkles',
  '⑧ 流转箱用布包裹，半成品分色分码区分': '⑧ Transfer bins covered, WIP color/size separated',
  '① 尺寸检验 每色每码 >10% 并记录': '① Size inspection >10% per color/size with records',
  '② 外观检验 每色每码 > 10% 并记录': '② Appearance inspection >10% per color/size with records',
  '③ 试身小中大码和封样/首件样 对比外观及功能性（特别是重点工序），并记录': '③ Try-on S/M/L vs sealed/first article for appearance & function',
  '④ 中检合格品/非合格品分开摆放': '④ Mid-line pass/fail separated',
  '⑤ 不合格品需立即退回对应工序翻修，并有组长跟进': '⑤ Failed items returned immediately for repair, group leader follows up',
  '⑥ 中检检验按工序记录疵点类型及比例，以便车工技能提升': '⑥ Mid-line defect type/ratio recorded by process for skill improvement',
  '① 按裁剪数量尺码数领取主标，尺码表，洗标': '① Pick main label, size label, wash label per cutting qty',
  '② 尺码表，洗标顺序不可错乱，以阅读方向缝制': '② Size label, wash label order correct, sewn in reading direction',
  '③ 一码一清，一款一清，如有剩余唛头，需追溯原因，并有组长跟进解决': '③ One size one clear, trace leftover labels',

  // Finishing Quality Control
  '① 后道区域划分明确，并有清晰标识': '① Finishing area clearly divided and labeled',
  '② 中转箱需要明确标识': '② Transfer bins clearly labeled',
  '③ 样衣和资料悬挂在后道区域': '③ Sample garments and docs displayed',
  '① 按纸样点位，（禁止使用高温消色笔）': '① Per pattern position (no high-temp disappearing pen)',
  '③ 疵点问题需清晰标识': '③ Defects clearly marked',
  '④ 待检品/合格品/不合格品分开放置': '④ Pending/Pass/Fail separated',
  '⑤ 污渍清理需在指定区域清理（确保返工后无水印，无变色，无异味）': '⑤ Stain cleaning in designated area (no watermark/discolor/odor)',
  '⑥ 总检跟踪翻修品，当天款当天结束': '⑥ Final inspection tracks repair, same-day completion',
  '⑦ 总检汇总100%检验记录（报告）和疵点问题（建议汇总次品率），并反馈生产部门改进': '⑦ Final inspection 100% records and defects summary for production',
  '① 是否有标准包装样': '① Standard packaging sample available',
  '② 分色分码分区包装（潮湿度需达到客户要求）': '② Color/size/zone separated packaging (humidity meets customer)',
  '③ 胶袋贴纸和裁剪数尺码吻合，一码一清，分码入筐': '③ Bag labels match cutting qty/size, one size one clear',
  '④ 一款一清，如有剩余贴纸，需追溯原因，并由组长跟进解决': '④ One style one clear, trace leftover labels',
  '⑤ 9点测试记录及检针报告': '⑤ 9-point test records and needle detection report',
  '① 按装箱单装箱（业务部门评估复核）': '① Pack per packing list (sales dept re-check)',
  '② 纸箱尺寸和质量是否按客人要求': '② Carton size and quality per customer',
  '③ 纸箱外观（不可鼓箱，不可超重，不可空箱）': '③ Carton appearance (no bulging/overweight/empty)',
  '④ 箱唛贴纸信息核对，里外一致（与箱单/订单）': '④ Carton label info verified, inside/outside consistent',

  // Quality Department
  '① 按AQL4.0/L2检验': '① AQL 4.0/L2 inspection',

  // Other
  '① 是否有标准Dummy': '① Standard dummy available',
  '① 是否专人专管（如裁剪刀等）': '① Dedicated person management (e.g. cutting scissors)',
  '② 是否有完整的换针记录': '② Complete needle change records',
  '③ 小剪刀等是否捆绑固定': '③ Small scissors tied/secured',
  '① 个人生活物品食物等禁止出现在生产区域': '① No personal items/food in production area',

  // Flat Knit - Raw Material Inspection
  '① 核对成分': '① Verify composition',
  '② 核对规格、支数': '② Verify specs and count',
  '③ 核对颜色及批次（缸号）': '③ Verify color and batch (lot)',
  '④ 检查包装': '④ Check packaging',
  '⑤ 检查重量': '⑤ Check weight',
  '⑥ 检查回潮率': '⑥ Check moisture regain',
  '⑦ 检查异味': '⑦ Check odor',
  '① 检查花色': '① Check color shade',
  '② 颜色/缸差（标准光源下比对）': '② Color/lot shade (D65 light box)',
  '③ 纱筒变形、沾污、磨损': '③ Yarn cone deformation, contamination, abrasion',
  '④ 花色超标': '④ Color shade exceeded standard',
  '① 每个色组：做首件尺码样（按客户确认样尺寸打样）': '① Per color group: first article size sample (per customer approved)',
  '② 每个色组：测试回潮率/尺寸/克重': '② Per color group: test moisture/size/weight',
  '③ 每个色组：密度测试（重量与纱支的对照/外观/做工）': '③ Per color group: density test (weight vs count/appearance/workmanship)',
  '④ 每个色组：纱线整体外观与确认的大货对照外观目测检验': '④ Per color group: overall yarn appearance vs approved bulk visual check',
  '⑤ 每个色组：支数（纱线称重）': '⑤ Per color group: count (yarn weighing)',
  '⑥ 每个色组：缩水率（织片）': '⑥ Per color group: shrinkage (panel)',
  '① 托盘存放不靠墙、不靠窗、不落地': '① Pallet storage away from walls/windows, no ground',
  '② 仓储环境管控：避光储存及防潮防霉': '② Warehouse environment: light/moisture-proof',
  '③ 执行先进先出': '③ FIFO execution',
  '④ 库存6个月以上的纱线管理': '④ Yarn inventory >6 months management',
  '① 纱线的过蜡工艺确认书（如丝线、金属纱、弹力纱如含尼龙纱等不可过蜡）': '① Yarn waxing process confirmation (silk/metal/elastic with nylon excluded)',
  '② 合格的络纱工艺操作及现场的管理（清洁、有序及产品色生产）': '② Qualified winding operation and on-site management',
  '③ 合股工艺操作无混色不均': '③ Plying operation no uneven color mixing',

  // Flat Knit - Process Design
  '① 每色用大货纱线按产品组织结构织小片（如20×20cm或12针200针200转，7针100针100转；5针80针80转；3针60针60转的小片）': '① Per color, knit sample with bulk yarn per structure (e.g. 20×20cm or 12G 200N 200T, 7G 100N 100T, 5G 80N 80T, 3G 60N 60T)',
  '② 准确测出1cm纵向转数/横向针数': '② Accurately measure stitches/runs per 1cm',
  '③ 洗前、洗后尺寸': '③ Size before/after wash',
  '④ 结合横机特性/成衣外观/后整理因素制定生产工艺单': '④ Production process sheet combining machine/appearance/finishing',
  '⑤ 未织小片': '⑤ No sample knitted',
  '① 智能吓数系统生成全码工艺排针图及制版，或人工生成排针图再用恒强系统等软件精准排针制版': '① Smart CAD system full-size needle arrangement or manual + software precision',
  '② 字码（密度）转及收放针无错误': '② Stitch (density) and shaping error-free',
  '① 横机织造无系统报错（撞针/漏针）': '① Flat knitting no system errors (needle hit/miss)',
  '① 按密度平方和尺寸表算出大货推码克重': '① Calculate bulk weight per density² and size table',
  '② 织片下机尺寸控制': '② Off-machine panel size control',

  // Flat Knit - Pre-production Meeting
  '① 客户确认样': '① Customer-approved sample',
  '② 确认意见，明确客户要求': '② Confirmation, clear customer requirements',
  '③ 产前样（客户确认码及最大码或齐码）': '③ Pre-production sample (customer approved size and largest/full size)',
  '④ 生产工艺单': '④ Production process sheet',
  '① 各部门提出该产品的技术难点/生产重点/潜在质量问题，或找出工艺、尺寸、做工、结构不合理处': '① Each dept identifies technical difficulties/production focus/potential quality issues',
  '② 提出相应的改进建议，研讨并制定预防方案，明确标注需与客户确认的问题并跟踪结果': '② Improvement suggestions, prevention plan, items needing customer confirmation',
  '① 记录完整（措施/责任人/时间节点）': '① Complete records (measures/responsible person/timeline)',
  '② 产前样首件随大货同色最后一批下中查出运，封样卡交质量部，本记录保留一年': '② First article pre-production sample with last bulk batch, sealed card to QC dept, keep 1 year',

  // Flat Knit - Fabric Inspection
  '① 织片上机前织小片': '① Knit sample before machine loading',
  '② 通过拉密/挂长测试': '② Pass tension/length test',
  '① 按工艺规定频次做拉密/挂长测试（至少每12小时2次）': '① Tension/length test per process frequency (≥2 per 12hrs)',
  '② 单股纱换纱后须重新做拉密/挂长测试并调整参数': '② Single yarn change needs re-test and parameter adjustment',
  '③ 更换颜色（缸号）后必须重新做拉密/挂长测试': '③ Color (lot) change must re-test',
  '① 密度尺寸检查（及人为回修后测量衣片规格并称重）': '① Density/size check (measure & weigh after manual repair)',
  '② 下机重量检测（通常误差≤3%）': '② Off-machine weight check (≤3% tolerance)',
  '③ 不合格品排除并调整横机，系列性问题立即上报': '③ Remove non-conforming and adjust machine, report systematic issues',
  '① 核对及检查颜色': '① Verify and check color',
  '② 提花/间色衣片需与确认样或款式彩图100%比对': '② Jacquard/multi-color pieces 100% match approved sample or artwork',
  '① 密度、尺寸、重量检查': '① Density, size, weight check',
  '② 外观（油污、污渍、编织疵点等）': '② Appearance (oil, stains, knitting defects)',
  '③ 罗纹长度、夹档转数、收针次数': '③ Rib length, joining runs, shaping times',
  '④ 附件检验（领子、腰带等附件排针及密度检查，检查辅线是否适合圆盘机套口/排针）': '④ Accessory check (collar, belt needle/density, auxiliary line for circular machine)',

  // Flat Knit - Linking
  '① 机器针型': '① Machine needle type',
  '② 缝制流程': '② Sewing process',
  '③ 缝合密度': '③ Stitch density',
  '④ 缝合线材材质': '④ Thread material',
  '① 缝合线与衣片拉伸性、弹性匹配或符合工艺要求': '① Thread elasticity matches panels or process requirements',
  '② 缝合线断裂强力达标，附件附着力满足童装安全要求(如生产童装需看到强力测试设备）': '② Thread breaking strength meets standard, accessory adhesion for children safety',
  '③ 缝合线颜色匹配或符合工艺要求': '③ Thread color matches or process requires',
  '① 采用合理的线迹，如线缝拉长率达到130%不断裂（夹圈、袖缝、侧缝具合理的拉伸性，且不断线）': '① Reasonable stitch, 130% stretch without breakage',
  '② 领子缝合圆顺，领位量达标；下摆、袖口等部位弹性符合工艺要求': '② Collar sewing smooth, collar position correct; hem/cuff elasticity per process',
  '③ 大身/袖子/肩型：缝合平直无铲针洞，挂肩收针花严格对齐': '③ Body/sleeve/shoulder: flat sewing, no needle holes, armhole shaping aligned',
  '④ 花型和间色必须对齐或对称；缝份、对位一致且符合工艺要求': '④ Pattern and color must align/symmetrize; seam allowance consistent',
  '⑤ 检验及套灯（缝合均匀度、每件套灯检查跳、漏针）': '⑤ Inspection & light box (seam uniformity, skip/miss needle per garment)',
  '① 首件产品必须：符合工艺单标准': '① First article must meet process sheet standards',
  '② 记录首件的测试及检查结果，并保留首件在此生产小组至生产结束': '② Record first article test/inspection, keep until production end',
  '③ 无首件样': '③ No first article sample',

  // Flat Knit - Washing & Drying
  '① 首件测试调整工艺参数（浸泡/洗涤时间、脱水转速、烘干温度/时间、助剂配比、单缸数量）': '① First article test adjusts process (soak/wash time, spin, dry temp/time, auxiliaries, per-lot qty)',
  '② 复核尺寸,手感及重量': '② Verify size, hand feel, weight',
  '③ 首件须保留至此产品完成水洗工序': '③ Keep first article until wash complete',
  '① 分缸控制，辅料、印花/烫钻等洗前预处理': '① Per-lot control, pre-wash treatment for trims/prints',
  '② 投产前小批量测试，对比确认样：（水洗效果、手感及外观质量、水洗色牢度等）': '② Pre-production small batch test vs approved sample (wash effect, hand feel, color fastness)',
  '③ 大货水洗温度、洗涤时间、脱水转速、助剂用量、pH值': '③ Bulk wash temp/time/spin/auxiliaries/pH',
  '④ 大货烘干操作：温度、时间、织物反面烘干、烘干中抽测尺寸、充分冷却后取出': '④ Bulk dry: temp/time/reverse side/size check/cool before removal',
  '① 每缸检查：尺寸稳定性': '① Per lot: size stability',
  '② 每缸检查：手感（柔软、顺滑，无干涩、硬扎等）、颜色（无色差、色花、掉色等）、味道': '② Per lot: hand feel, color, odor',
  '③ 每缸检查：外观及水洗效果（无破洞、勾丝、变形、起球等）': '③ Per lot: appearance & wash effect (no holes, snags, deformation, pilling)',

  // Flat Knit - Button & Tag
  '① 主标、尺码标、水洗标及装饰标等页数及内容正确': '① Main/size/wash/decorative labels correct pages & content',
  '② 锁眼、钉扣及标牌位置符合工艺单要求，且无高温消尖笔定位': '② Buttonhole/button/tag position per process, no high-temp disappearing pen',
  '① 缝线匹配（材质、颜色正确）': '① Thread match (material, color correct)',
  '② 线头处理干净，打结方式符合客户要求（平结/藏结等）': '② Clean thread ends, knotting per customer (flat/hidden)',
  '③ 手工收口牢固': '③ Hand closing secure',
  '④ 钉扣、锁眼无磨损、开线及松脱': '④ Button/buttonhole no wear, opening, loosening',
  '① 钉扣、装饰标及附件等需通过3次标准拉力测试不脱落，且符合童装安全要求(童装需有测试仪器）': '① Button/decorative/accessory pass 3× tension test, children safety compliant',

  // Flat Knit - Ironing
  '① 根据纱线特性、组织密度等设定熨烫温度、时间及熨烫方式（如轻蒸汽熨烫及加垫布或熨斗底部保护套）': '① Set ironing temp/time/method per yarn/density (light steam, pad cloth, iron protection)',
  '② 整烫首件样与检验记录留存至产品生产结束': '② Keep first article ironed sample and records until production end',
  '① 每码首烫预缩前后测量尺寸': '① Measure size before/after pre-shrink for each size',
  '② 每款制作专用烫版/烫衣架，清晰标注款号、尺码信息、尺寸度量点等': '② Dedicated ironing template/stand per style, clearly label style/size/measurement points',
  '① 无烫痕、无极光、无蒸汽水印': '① No iron marks, no shine, no steam watermark',
  '② 产品平铺存放，避免压痕褶皱': '② Flat storage, avoid pressure marks and wrinkles',
  '① 专人测量并记录尺寸，冷却24小时后100%复测（此项也可以在后续的检验工序复核）': '① Dedicated measurement, 100% re-check after 24hr cooling (can be in later inspection)',
  '② 不合格品分析原因及改善措施（严禁硬性拉烫改变尺寸）': '② Analyze non-conforming causes and improvement (no forced ironing to change size)',
  '③ 确保产品抽湿排风': '③ Ensure moisture extraction and ventilation',
  '① 整烫组长抽查：尺码更换须检查首批产品，按每位烫工抽查至少10%（外观质量及关键部位尺寸）': '① Ironing group leader spot check: ≥10% per ironer (appearance & key size)',

  // Flat Knit - Inspection
  '① 质检主管培训检查员并制定检验流程（强调该款产品的质量要求、潜在风险控制点及流程，如：整烫前照灯检查，整烫后复检，特殊结构需二次整烫定型后三检）': '① QC supervisor trains inspectors and sets inspection process (quality requirements, risk control, light check before ironing, recheck after ironing, special structures 3rd check after final pressing)',
  '② 确认标准样须展示在操作车间至产品生产结束': '② Approved standard sample displayed in workshop until production end',
  '① 检验台整洁': '① Inspection table clean',
  '② 光线符合要求（至少500-750LUX）': '② Lighting meets requirement (≥500-750LUX)',
  '③ 颜色分开存放': '③ Colors stored separately',
  '① 按确认样和工艺单要求：检查顺序是否有遗漏（如从上到下、从左到右、翻转检查）': '① Per approved sample & process: inspection sequence complete (top-bottom, left-right, flip)',
  '② 尺寸测量（如在前道已100%检查，后道按一定比例抽查，至少10%）': '② Size measurement (if prior 100%, later spot check ≥10%)',
  '① 按疵品分类处理（如：原材料疵点；附件/辅料疵点；做工疵点；外观疵点等；整烫、尺寸疵点；唛头/包装/数量/安全问题等）': '① Classify defects (raw material; accessory/trim; workmanship; appearance; ironing/size; label/packaging/quantity/safety)',
  '② 不合格品专区存放，返修品需重新检验': '② Non-conforming in dedicated area, re-inspect repair items',
  '① 按客户AQL标准进行最终抽检（注意试身效果检查）': '① Final AQL spot check per customer (try-on check)',
  '① 质量主管定期汇总报告，根据所记录的疵点召开质量会议，分析并改善': '① QC supervisor periodic summary report, quality meetings to analyze defects',

  // Flat Knit - Packaging
  '① 每色每码进行包装测试，确保：成衣无压痕': '① Packaging test per color/size, no pressure marks',
  '② 胶袋不爆口、产品无滑落': '② No bag burst, no product slip',
  '③ 每码纸箱重量符合要求，纸箱无变形': '③ Carton weight meets requirement, no deformation',
  '① 全套包装辅料卡': '① Complete packaging trim card',
  '② 包装作业指导书、确认包装标准样，保留至生产结束': '② Packaging SOP, approved standard sample, keep until production end',
  '③ 组长按工艺要求培训包装工，按标准方法折叠和包装（外观统一平整、折叠尺寸吻合胶袋尺寸）': '③ Group leader trains packers per process, standard folding (appearance uniform, fold matches bag size)',
  '① 产品无潮湿、无异味': '① No moisture/odor',
  '② 颜色分装、尺码分袋、按搭配分装': '② Color/size/coordination separate packaging',
  '① 包装辅料分发数量需与箱单吻合': '① Packaging trim distribution qty matches packing list',
  '② 辅料质量与订单要求吻合（正确的胶袋、条形码、价格吊牌、箱唛等）': '② Trim quality matches order (correct bag, barcode, price tag, carton mark)',
  '① 按验针流程操作:按要求定时检测、校准机器': '① Follow needle inspection process: periodic test/calibrate machine',
  '② 污染物严格分离管理': '② Contaminants strictly separated',
  '③ 九点测试记录及验针报告': '③ 9-point test records and needle inspection report',
  '① 包装主管需定期检查，如：辅料质量（包装辅料及产品上的附件）、折叠方法、装箱搭配、数量及重量、潮湿度检测等': '① Packaging supervisor periodic check: trim quality, folding, packing coordination, qty/weight, humidity test',
};

// Details translations
export const detailsTranslations: { [key: string]: string } = {
  '标识不明确': 'Unclear labels',
  '未分开堆放': 'Not stacked separately',
  '面料井字堆放': 'Fabric cross-stacked',
  '堆放高度过高': 'Stacking too high',
  '靠墙': 'Against wall',
  '靠窗': 'Against window',
  '未避光储存': 'Not stored away from light',
  '未防潮防霉': 'Not moisture/mold-proof',
  '无验布记录': 'No fabric inspection record',
  '无测试记录': 'No test record',
  '无缸差布': 'No lot shade cloth',
  '现场工人操作不规范': 'Worker operation non-standard',
  '500m以下未全检': '<500m not 100% inspected',
  '500m以上抽检不足10%': '>500m sampling <10%',
  '订单/款号/色号标识不清晰': 'Order/style/color label unclear',
  '分类堆放标识不清晰': 'Category stacking label unclear',
  '无品类记录': 'No category record',
  '无数量记录': 'No quantity record',
  '无型号': 'No model',
  '无颜色': 'No color',
  '无功能': 'No function',
  '无内容': 'No content',
  '无外观': 'No appearance',
  '无裁剪': 'No cutting',
  '无生产主管': 'No production supervisor',
  '无生产组长': 'No group leader',
  '无客户确认码': 'No customer approved size',
  '无最大码': 'No largest size',
  '无最小码': 'No smallest size',
  '无封样': 'No sealed sample',
  '订单号标识不清晰': 'Order no. label unclear',
  '缸号/卷号不清晰': 'Lot/roll no. unclear',
  '开始及结束时间不清晰': 'Start/end time unclear',
  '面料不平整有褶皱': 'Fabric not flat, wrinkled',
  '拉伸变形': 'Stretched deformation',
  '纬斜': 'Skew',
  '布边未对齐': 'Selvedge misaligned',
  '裁片未分码分色存放': 'Cut pieces not size/color separated',
  '裁片落地': 'Pieces on ground',
  '尺寸不符合要求': 'Size does not meet requirement',
  '质量不符合要求': 'Quality does not meet requirement',
  '鼓箱': 'Bulging carton',
  '超重': 'Overweight',
  '空箱': 'Empty carton',
};

// Comment translations
export const commentTranslations: { [key: string]: string } = {
  '监控湿度的变化，便于采取相应的解决方案（如抽湿）': 'Monitor humidity changes for solutions (e.g. dehumidify)',
  '测试记录和缸差布可预防面料品质问题和色差问题': 'Test records and lot shade cloth prevent quality and color issues',
  '缸差核对要在灯箱里进行，灯光要用D65光源': 'Lot shade check in light box with D65 light',
  '可以控制大货的色牢度，沾色等问题': 'Controls bulk color fastness and staining',
  '面料缩率大于3%时，成衣工厂的尺寸控制难度较大': '>3% shrinkage makes garment size control difficult',
  '每缸缩率测试可以更好的控制大货成衣尺寸（纸版可以进行放缩率）': 'Per-lot shrinkage test for better bulk size control',
  '盘点一年以上的库存面料禁止使用（成衣撕裂牢度等会受影响）': 'No >1yr stock fabric (tear strength affected)',
  '以防辅料发放错款': 'Prevent wrong trim distribution',
  '预防做到衣服上起皱，起浪等问题': 'Prevent garment wrinkles and waves',
  '技术部对前期开发比较了解，可以规避打样时发生的问题，更好的控制大货品质': 'Tech dept familiar with development, prevents sampling issues',
  '质量部门要跟进技术部提出的问题点及大货品质': 'QC dept follows up tech issues and bulk quality',
  '业务部门告知面辅料情况及订单进度': 'Sales dept informs trim status and order progress',
  '二次加工负责人主要时了解二次加工的产品如何控制品质': 'Secondary processing reps understand quality control',
  '给车间生产员工一个质量标准参照': 'Quality reference for production workers',
  '做最小码和最大码衣服，可提前预知大货可能出现的问题': 'Smallest/largest size predicts bulk issues',
  '放缩后困扎面料，会影响面料的回缩': 'Bundling after relaxation affects fabric recovery',
  '多卷放在一起，会影响压在下方面料的回缩，敏感面料会产生压痕': 'Multi-roll affects lower fabric recovery, sensitive fabric gets pressure marks',
  '预防脏污，潮湿等问题': 'Prevent dirt and moisture',
  '预防大货有色差，色光': 'Prevent bulk color/shade differences',
  '控制裁片的精准度，（层高太高容易偏刀，尺寸控制不准确）': 'Cut precision (high layer = deviation)',
  '以防铺布时把面料拉伸': 'Prevent stretching during spreading',
  '控制换片导致色差': 'Control color difference from piece change',
  '复核裁片的精准度': 'Re-check cut piece precision',
  '预防沾色，脏污等': 'Prevent staining and dirt',
  '预防裁片粘衬后变形': 'Prevent piece deformation after fusing',
  '控制缝制起皱，磨破面料等问题': 'Control sewing wrinkles and fabric damage',
  '高温消色笔在低温（零下）会显现出来': 'High-temp disappearing pen shows at low temp',
  '供后道核对品质和尺寸等': 'For finishing QC and size verification',
  '预防大货衣服错码': 'Prevent wrong size in bulk',
  '预防半成品衣服在流转过程中勾纱，脏污': 'Prevent WIP snagging and dirt during transfer',
  '供后道核对品质和尺寸等': 'For finishing QC and size check',
  '确保返工后无水印，无变色，无异味': 'Ensure no watermark/discolor/odor after rework',
  '后续提升大货的品质的依据': 'Basis for bulk quality improvement',
  '预防包装错码': 'Prevent packaging size error',
  '控制衣服内的金属和安全性': 'Control garment metal and safety',
  'No First Article Sample': 'No First Article Sample',
  'Color Exceeded Standard': 'Color Exceeded Standard',
  'No Sample Knitted': 'No Sample Knitted',
  'Wrong style/size/customer': 'Wrong style/size/customer',
  'Style/color/size wrong': 'Style/color/size wrong',
  'Sample garment size record inconsistent': 'Sample garment size record inconsistent',
};

// Guidance translations
export const guidanceTranslations: { [key: string]: string } = {
  '有检查记录可查得满分。（无记录但是库管人员能现场描述或演示正确的操作流程可得半数分。）': 'Full score if check records available. (Half score if no records but staff can demonstrate correct process on-site.)',
  '项①需准确描述出如何检测花色（拆包检查筒纱外观或织成布片后看布片外观），并给出检查的比例。（能提供织片检查记录或者筒纱花色照片记录，无记录但是描述流程正确可得半数分）。': 'Accurately describe how to check color shade (open package to check cone appearance, or knit swatch to check) and provide check ratio. (Half score with photo records or correct description.)',
  '需有标准色样，需有D65光源。': 'Standard color sample and D65 light source required.',
  '若无记录但是负责人能够现场演示正确的检验方法，可得半数分，且评估员现场需抽查任意两包不同类型纱线。': 'Half score if no records but supervisor can demonstrate correct method. Auditor on-site spot check 2 different yarn packages.',
  '需提供实际的首件样品，或者打样记录。': 'Actual first article sample or sampling records required.',
  '需提供测试记录。': 'Test records required.',
  '需提供齐码样品或者测试记录。': 'Full-size samples or test records required.',
  '评估员需现场对比复检大货与确认的样品。': 'Auditor on-site compare bulk with approved sample.',
  '需提供检查记录，无记录但是有测试样且能正确描述操作流程（需通过织小片称重或者与确认样品进行核对）可得半数分。': 'Check records required. Half score with test sample and correct description (weight swatch or compare with approved).',
  '需提供检查记录，无记录但是能正确描述操作过程可得半数分。': 'Check records required. Half score with correct description.',
  '评估员现场观察，有任何违规即不得分。': 'Auditor on-site observation. Any violation = 0.',
  '评估员现场观察仓储环境以及是否配备温湿度计和对应的检查记录，有任何违规即不得分。': 'Auditor observes warehouse environment and hygrometer/records. Any violation = 0.',
  '需查阅工厂的出入库记录，无记录但是工厂描述正确可得半数分。': 'Check factory in/out records. Half score if no records but description is correct.',
  '需现场检查近一年的纱线出入库记录，是否有6个月以上纱线的使用情况，如有，需提供重新检测的记录，避免发霉、损坏、变色等纱线的使用。': 'Check yarn in/out records of past year for >6 month stock. Re-test records required to prevent mold/damage/discolor.',
  '工厂需提供确认工艺书，或者提供络纱过蜡的标准指导文件，否则不得分。': 'Factory provides process confirmation or waxing standard guide, else 0.',
  '评估员现场需观察络纱过蜡的环境和实际操作，检查是否有违规项（如有违规即不得分）。': 'Auditor on-site observe waxing environment and operation. Any violation = 0.',
  '评估员现场观察合股操作，如果是外发工厂合股，需提供首批合股纱的编织确认小样。': 'Auditor observes plying. If outsourced, first batch plying yarn swatch confirmation required.',
  '需提供用于测试的小片或者记录供评估员参考。': 'Test swatch or records required for auditor reference.',
  '需提供记录，评估员需核实结果是否正确。': 'Records required. Auditor verifies correctness.',
  '需提供制定的工艺单，评估员需核实是否正确。': 'Process sheet required. Auditor verifies correctness.',
  '评估员需现场观察横机编织过程是否有报错，检查织片是否有漏针等系列性疵点，有错误即不得分。': 'Auditor observes knitting process for errors and panel for systematic defects. Errors = 0.',
  '需提供全码克重记录及织片下机重量记录、总重量记录。': 'Full-size weight records and off-machine panel/total weight records required.',
  '需提供织片下机尺寸记录，评估员需现场核实产品（如：双梭编织（包芯纱/尼龙）产品通常误差在5%以内，对于棉、棉/腈、腈纶这几种纱线，下机尺寸要求误差2%以内，通常偏小不可超过1cm, 否则洗后极有可能偏小2cm以上）': 'Off-machine size records required. Auditor verifies (e.g., double-ply/core-spun/nylon ≤5%, cotton/cotton-acrylic/acrylic ≤2%, typically not >1cm smaller, else after wash may be >2cm smaller).',
  '需提供会议记录，群发短信或者邮件能体现参会人员名单，或者评估员现场参加产前会核实对应的部门人员是否参会得全分。（无记录或者有部门缺席即不得分）。': 'Meeting records or mass SMS/email with attendee list required. Auditor attend meeting to verify. (No record or dept missing = 0.)',
  '评估员现场核查产前会的资料是否齐全、正确。': 'Auditor on-site check pre-production materials are complete and correct.',
  '需提供证明的文件记录（会议记录，群发短信或者邮件），或者现场演示一次正式的产前会供评估员参照检查。': 'Documentary proof (meeting records, mass SMS/email) or live pre-production meeting demo required.',
  '需提供会议记录，纸质版或者生产群里发送的会议记录都可。': 'Meeting records required (paper or in production group).',
  '评估员需结合工艺复核此小片。': 'Auditor cross-check this swatch with process.',
  '需提供测试记录并符合要求可得全分，无记录但是操作工能够正确的描述操作流程可得半数分。': 'Test records meeting requirements = full score. No records but correct description = half.',
  '评估员现场与工艺单进行核对，检查操作是否规范或遗漏。': 'Auditor on-site check against process sheet for compliance.',
  '检查工厂的上报记录，无记录但是检验人员能正确描述问题上报过程，可得半数分。': 'Check factory escalation records. No records but correct description = half.',
  '现场要有标准样或者彩图供操作工核对，如果无标准样或者未核对则对应项不得分，评估员现场发现错误也不得分。': 'Standard sample or artwork for operator check on-site. Missing = 0.',
  '需提供缝合工艺指导书，评估员对照指导书检查大货是否正确，如有错误则对应的项目不得分。': 'Sewing process guide required. Auditor checks bulk against guide. Errors = 0 for the item.',
  '操作工现场有对缝合部位进行拉伸及强力检查且评估员现场复查大货合格（如生产童装，现场需有拉力测试仪器且评估员现场抽测合格；如果现场无仪器，但工厂需提供有资质的三方测试报告，不满足童装拉力要求倒扣3分）。': 'Operator on-site stretch and strength check, auditor re-check bulk. (For children: tension test instrument on-site and auditor spot check pass; or third-party test report. Failure to meet children tension = -3.)',
  '评估员根据工艺单和首件样对大货进行核对。': 'Auditor checks bulk against process sheet and first article.',
  '评估员现场观察操作工操作是否规范或遗漏，同时对大货进行抽检是否合格。': 'Auditor observes operation and spot check bulk.',
  '需套灯的款式遗漏套灯或者套灯检查有疏漏，则套灯对应项不得分。': 'Styles requiring light box missing check = 0.',
  '缝合车间必须有首件样以及对应的检查记录，评估员需现场检查首件样是否与工艺单相符。': 'First article sample and records required in sewing workshop. Auditor checks vs process sheet.',
  '需提供水洗作业指导书或产前样上明确时间、温度、助剂配比、单缸数量等。': 'Wash SOP or pre-production sample with time/temp/auxiliaries/per-lot qty required.',
  '需有水洗首件样。': 'Wash first article sample required.',
  '需提供小批量测试的记录，若无记录但负责人能正确描述小批量测试的流程可得半数分。': 'Small batch test records required. No records but correct description = half.',
  '评估员现场评估操作是否规范或遗漏，同时与首件样做对比检查大货是否合格。': 'Auditor on-site evaluate operation and compare with first article.',
  '需提供机器检测/校准记录。': 'Machine test/calibration records required.',
  '评估员现场评估操作是否规范，缺该项倒扣3分。': 'Auditor on-site evaluate. Missing = -3.',
  '需提供测试记录与验针报告，评估员现场复核操作是否规范。': 'Test records and needle inspection report required. Auditor on-site verify.',
  '需提供整烫工艺指导书，明确整烫注意事项（如熨烫温度、时间与方式等）。': 'Ironing SOP required with temp/time/method notes.',
  '现场需有整烫首件样以及检查记录。': 'First article ironed sample and records on-site.',
  '需提供预缩前后的尺寸测量记录，无记录但是操作工能准确描述出"烫-放-量-改"流程，可得半数分。': 'Pre/post-shrink size measurement records required. Half score with correct iron-rest-measure-modify description.',
  '评估员现场检查，如有缺失即不得分。': 'Auditor on-site check. Missing = 0.',
  '评估员现场对烫后产品进行抽查是否合格。': 'Auditor spot check ironed products.',
  '需提供尺寸测量记录（复测记录时间需间隔至少1天），且现场有"熨烫产品静置区"；无记录但是检验车间有100%尺寸复测环节可得半数分；缺100%复测倒扣3分。': 'Size measurement records (≥1 day between) and ironed product resting area. No records but 100% recheck process = half. Missing 100% recheck = -3.',
  '评估员需现场评估操作是否规范。': 'Auditor on-site evaluate operation.',
  '工厂需提供抽查记录且评估员现场能看到有专人对整烫产品进行抽查控制。': 'Spot check records required. Auditor on-site verify dedicated person spot checking.',
  '评估员需结合培训记录或制定的检验流程，评估现场大货的实际操作流程是否规范。': 'Auditor check bulk operation vs training records/inspection process.',
  '需有大货对应的标准样在车间展示。': 'Standard sample for bulk displayed in workshop.',
  '评估员现场评估对应项是否规范。': 'Auditor on-site evaluate item.',
  '评估员现场评估操作是否规范或遗漏。': 'Auditor on-site evaluate operation and check omissions.',
  '需提供尺寸测量记录，无记录但评估员现场检查有专人负责100%尺寸测量工序且操作规范，可得半数分。': 'Size measurement records required. Half score with dedicated 100% measurement person and standard operation.',
  '不合格品必须专放且有明确的标识区，评估员现场评估不合格品存放以及返修品操作是否规范。': 'Non-conforming in dedicated area with clear label. Auditor on-site evaluate storage and repair operation.',
  '需提供抽检记录或报告。': 'Spot check records or report required.',
  '需提供汇总报告文件或会议记录。': 'Summary report or meeting records required.',
  '评估员现场检查大货包装是否合格。': 'Auditor on-site check bulk packaging.',
  '评估员现场需检查对应的资料是否齐全。': 'Auditor on-site check materials complete.',
  '评估员现场评估操作工是否规范。': 'Auditor on-site evaluate operator.',
  '需提供检查记录且评估员需现场抽检大货是否合格，无记录但评估员现场可以看到有工人在实际操作此流程可得半数分。': 'Check records and auditor spot check. Half score if no records but staff visibly operating.',
  '需提供检查记录，无记录但评估员现场可以看到巡检工序，且现场有测潮设备在使用可得半数分。': 'Check records required. Half score with visible patrol and moisture test equipment.',
  '需提供有资质的三方测试报告，童装不符合安全要求倒扣3分': 'Provide qualified third-party test report. Children non-compliance = -3.',
};

// Penalty rule translations
export const penaltyRuleTranslations: { [key: string]: string } = {
  '注意：评估员现场需抽查任意两包不同类型纱线，发现花色超标则此大项为0分。': 'Note: Auditor spot checks 2 different yarn packages. Color shade exceeded = 0 for this sub-module.',
  '若勾选此项，则①②③均不得选择且此大项为0分': 'If selected, ①②③ cannot be selected and this sub-module = 0',
  '若①勾选0分，则此项大项得0分': 'If ① = 0, this sub-module = 0',
  '若勾选此项，则①②③④均不得选择且此大项为0分': 'If selected, ①②③④ cannot be selected and this sub-module = 0',
  '若②得0分则①不得选且此大项为0分': 'If ② = 0, ① cannot be selected and this sub-module = 0',
  '若①得0分，则②不得选择且此大项为0分': 'If ① = 0, ② cannot be selected and this sub-module = 0',
  '若勾选-1分，则①和②不得勾选，且整个大项扣1分': 'If -1 selected, ① and ② cannot be selected, this sub-module -1',
};

// Skippable label translations
export const skippableLabelTranslations: { [key: string]: string } = {
  '无需织片检验，不参与评分': 'No panel inspection needed, not scored',
  '无需缝盘套口，不参与评分': 'No linking needed, not scored',
  '无需水洗烘干，不参与评分': 'No washing/drying needed, not scored',
  '无需锁眼钉扣，不参与评分': 'No buttonhole/button needed, not scored',
  '无需整烫，不参与评分': 'No ironing needed, not scored',
  '无需检验，不参与评分': 'No inspection needed, not scored',
  '无需验针，不参与评分': 'No needle inspection needed, not scored',
};

// Optional label translations
export const optionalLabelTranslations: { [key: string]: string } = {
  '无需验针，不参与评分': 'No needle inspection needed, not scored',
};

export function getModuleDisplayName(name: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    // Remove the score suffix like "（共5分）" or "（10分）" before translation
    const cleaned = name.replace(/[（(][^)）]*分[)）]$/, '').trim();
    return moduleNameTranslations[name] || moduleNameTranslations[cleaned] || cleaned;
  }
  return name;
}

export function getSubModuleDisplayName(name: string, language: 'zh' | 'en'): string {
  // Remove the score suffix like "（共5分）" before translation
  const cleaned = name.replace(/[（(][^)）]*分[)）]$/, '').trim();
  if (language === 'en') {
    return subModuleNameTranslations[cleaned] || subModuleNameTranslations[name] || cleaned;
  }
  return name;
}

export function getItemDisplayName(name: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    if (itemNameTranslations[name]) {
      return itemNameTranslations[name];
    }
    // Try to find a partial match
    for (const [cn, en] of Object.entries(itemNameTranslations)) {
      if (name.includes(cn)) {
        return name.replace(cn, en);
      }
    }
  }
  return name;
}

export function getDetailsDisplayName(details: string[], language: 'zh' | 'en'): string[] {
  if (language === 'en') {
    return details.map(d => detailsTranslations[d] || d);
  }
  return details;
}

export function getCommentDisplayName(comment: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    return commentTranslations[comment] || comment;
  }
  return comment;
}

export function getGuidanceDisplayName(guidance: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    return guidanceTranslations[guidance] || guidance;
  }
  return guidance;
}

export function getPenaltyRuleDisplayName(rule: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    return penaltyRuleTranslations[rule] || rule;
  }
  return rule;
}

export function getSkippableLabelDisplayName(label: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    return skippableLabelTranslations[label] || label;
  }
  return label;
}

export function getOptionalLabelDisplayName(label: string, language: 'zh' | 'en'): string {
  if (language === 'en') {
    return optionalLabelTranslations[label] || label;
  }
  return label;
}
