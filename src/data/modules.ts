import { AuditModule } from '../types';

export const auditModules: AuditModule[] = [
  {
    id: 'pattern',
    name: '纸样、样衣制作',
    nameEn: 'Pattern & Sample Making',
    subModules: {
      '1. 纸样开发标准': {
        nameEn: '1. Pattern Development Standards',
        items: [
          { id: 'p1_1', name: '① 使用CAD软件制作/修改纸样', nameEn: '① Use CAD software to create/modify patterns', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_2', name: '② 缝份清晰标记应合规', nameEn: '② Seam allowance should be clearly marked and compliant', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_3', name: '③ 布纹线，剪口标注合规并清晰', nameEn: '③ Grain line and notches should be marked correctly and clearly', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_4', name: '④ 放码标准（尺寸增量）遵守客户要求，并文档化', nameEn: '④ Grading standards (size increments) follow customer requirements and are documented', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_5', name: '⑤ 技术包（Tech Pack）应明确标注尺寸表、工艺说明与要求，及特殊工艺说明（尤其是特殊面料或设计）', nameEn: '⑤ Tech Pack should clearly mark size chart, technical instructions and requirements, and special process notes (especially for special fabric or design)', score: 3, isKey: true, details: [], comment: '' },
        ]
      },
      '2. 版本控制与追溯性': {
        nameEn: '2. Version Control & Traceability',
        items: [
          { id: 'p2_1', name: '① 纸样版本控制系统（确保最新、准确、可追溯）', nameEn: '① Pattern version control system (ensure latest, accurate, traceable)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p2_2', name: '② 文档记录：纸样历史、修订、批准', nameEn: '② Document records: pattern history, revisions, approvals', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p2_3', name: '③ 物理纸样（平放/悬挂）及数字备份的安全存储', nameEn: '③ Secure storage of physical patterns (flat/hanging) and digital backups', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 初版审核与文档化': {
        nameEn: '3. Initial Review & Documentation',
        items: [
          { id: 'p3_1', name: '① 尺寸与工艺审核，应符合技术包要求（检验记录）', nameEn: '① Size and process review should meet tech pack requirements (inspection records)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p3_2', name: '② 面辅料核对，并按要求进行功能性检测（检验记录）', nameEn: '② Material and trim verification, with functional testing as required (inspection records)', score: 3, isKey: true, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'fabric',
    name: '面辅料品质控制',
    nameEn: 'Fabric & Trim Quality Control',
    skippable: true,
    skippableLabel: '无需参与面辅料品质控制评分',
    skippableLabelEn: 'No need for fabric & trim QC, not scored',
    subModules: {
      '1. 面料仓库检查': {
        nameEn: '1. Fabric Warehouse Inspection',
        items: [
          { id: 'm1_1', name: '① 合格/不合格品/待检标识应明确，分开堆放', nameEn: '① Pass/Fail/Pending labels should be clear, stacked separately', score: 1, isKey: false, details: ['标识不明确', '未分开堆放'], detailsEn: ['Unclear labels', 'Not stacked separately'], comment: '', commentEn: '' },
          { id: 'm1_2', name: '② 面料不可"井"字堆放，高度不可过高（建议<1.5m）（针织面料除外）', nameEn: '② Fabric should not be stacked in cross pattern, height should not exceed 1.5m (knitted fabric excluded)', score: 1, isKey: false, details: ['面料井字堆放', '堆放高度过高'], detailsEn: ['Cross stacking', 'Excessive stacking height'], comment: '', commentEn: '' },
          { id: 'm1_3', name: '③ 不同颜色及批次（缸号）分开堆放', nameEn: '③ Different colors and batches (dye lots) should be stacked separately', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm1_4', name: '④ 托盘存放不靠墙、不靠窗、避光储存及防潮防霉', nameEn: '④ Pallet storage: not against wall/window, light-proof, moisture-proof', score: 1, isKey: false, details: ['靠墙', '靠窗', '未避光储存', '未防潮防霉'], detailsEn: ['Against wall', 'Against window', 'Not light-proof', 'Not moisture-proof'], comment: '' },
          { id: 'm1_5', name: '⑤ 温湿度计及记录（湿度<65%）', nameEn: '⑤ Hygrometer and records (humidity <65%)', score: 1, isKey: false, details: [], comment: '监控湿度的变化，便于采取相应的解决方案（如抽湿）', commentEn: 'Monitor humidity changes to take appropriate solutions (e.g. dehumidification)' },
        ]
      },
      '2. 面料入库记录': {
        nameEn: '2. Fabric Incoming Records',
        items: [
          { id: 'm2_1', name: '① 面料厂验布记录/测试记录/缸差布', nameEn: '① Mill inspection records/test records/lot shade samples', score: 1, isKey: false, details: ['无验布记录', '无测试记录', '无缸差布'], detailsEn: ['No inspection record', 'No test record', 'No lot shade sample'], comment: '测试记录和缸差布可预防面料品质问题和色差问题', commentEn: 'Test records and lot shade samples prevent fabric quality and color issues' },
          { id: 'm2_2', name: '② 入库单（卷数，米数，克重等）', nameEn: '② Incoming records (rolls, meters, weight, etc.)', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 面料检验（织成试样检验）': {
        nameEn: '3. Fabric Inspection',
        items: [
          { id: 'm3_1', name: '① 四分制验布及现场演示', nameEn: '① 4-point system inspection and on-site demo', score: 1, isKey: false, details: ['无记录', '现场工人操作不规范'], detailsEn: ['No record', 'Improper worker operation'], comment: '' },
          { id: 'm3_2', name: '② 500m以下全检，500m以上至少抽检10%（覆盖每缸）', nameEn: '② Full inspection under 500m, at least 10% sampling above 500m (cover every lot)', score: 3, isKey: true, details: ['500m以下未全检', '500m以上抽检不足10%'], detailsEn: ['No full inspection under 500m', 'Sampling <10% above 500m'], comment: '' },
          { id: 'm3_3', name: '③ 核对面料厂缸差布和大货面料（颜色D65，克重，防静电）', nameEn: '③ Verify mill lot shade samples against bulk (color D65, weight, anti-static)', score: 1, isKey: false, details: [], comment: '缸差核对要在灯箱里进行，灯光要用D65光源', commentEn: 'Lot shade verification in light box with D65 light source' },
        ]
      },
      '4. 面料测试': {
        nameEn: '4. Fabric Testing',
        items: [
          { id: 'm4_1', name: '① 每缸测试记录（如水洗色牢度，干湿色牢度，PH值）', nameEn: '① Per-lot test records (e.g. wash fastness, wet/dry rub fastness, pH)', score: 1, isKey: false, details: [], comment: '可以控制大货的色牢度，沾色等问题', commentEn: 'Control bulk color fastness, staining issues' },
        ]
      },
      '5. 预缩记录和结果': {
        nameEn: '5. Pre-shrinkage Records & Results',
        items: [
          { id: 'm5_1', name: '① 面料缩率要求 ≤ 3%（水洗针织款除外）', nameEn: '① Fabric shrinkage requirement ≤ 3% (washable knit excluded)', score: 3, isKey: true, details: [], comment: '面料缩率大于3%时，成衣工厂的尺寸控制难度较大', commentEn: 'Shrinkage >3% makes garment size control difficult' },
          { id: 'm5_2', name: '② 每缸缩率记录', nameEn: '② Per-lot shrinkage records', score: 3, isKey: true, details: [], comment: '每缸缩率测试可以更好的控制大货成衣尺寸（纸版可以进行放缩率）', commentEn: 'Per-lot shrinkage testing helps control bulk garment sizing' },
        ]
      },
      '6. 面料出库记录及盘点记录': {
        nameEn: '6. Fabric Outgoing & Stock Records',
        items: [
          { id: 'm6_1', name: '① 出库记录含款号，缸号，米数，色号，时间，领料人等信息', nameEn: '① Outgoing records include style, lot, meters, color, time, picker, etc.', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm6_2', name: '② 盘点记录', nameEn: '② Inventory records', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm6_3', name: '③ 库存1年以上面料不可使用', nameEn: '③ Fabric in stock over 1 year cannot be used', score: 1, isKey: false, details: [], comment: '盘点一年以上的库存面料禁止使用（成衣撕裂牢度等会受影响）', commentEn: 'Fabric stocked over 1 year is prohibited (garment tear strength affected)' },
        ]
      },
      '7. 辅料仓库检查': {
        nameEn: '7. Trim Warehouse Inspection',
        items: [
          { id: 'm7_1', name: '① 辅料存放标识明确（订单/款号/色号，分类堆放）', nameEn: '① Trim storage clearly labeled (order/style/color, classified stacking)', score: 1, isKey: false, details: ['订单/款号/色号标识不清晰', '分类堆放标识不清晰'], detailsEn: ['Unclear order/style/color labels', 'Unclear classification labels'], comment: '以防辅料发放错款', commentEn: 'Prevent wrong trim issue' },
          { id: 'm7_2', name: '② 辅料入库记录（品类，数量）', nameEn: '② Trim incoming records (category, quantity)', score: 1, isKey: false, details: ['无品类记录', '无数量记录'], detailsEn: ['No category record', 'No quantity record'], comment: '' },
        ]
      },
      '8. 辅料检验': {
        nameEn: '8. Trim Inspection',
        items: [
          { id: 'm8_1', name: '① 正确辅料卡核对（型号，颜色，功能，内容，外观）', nameEn: '① Verify trim card (model, color, function, content, appearance)', score: 1, isKey: false, details: ['无型号', '无颜色', '无功能', '无内容', '无外观'], detailsEn: ['No model', 'No color', 'No function', 'No content', 'No appearance'], comment: '' },
        ]
      },
      '9. 辅料测试': {
        nameEn: '9. Trim Testing',
        items: [
          { id: 'm9_1', name: '① 织带，橡筋，拉链，绳子的预缩测试（水洗缩，烫蒸缩）', nameEn: '① Pre-shrinkage test for webbing, elastic, zippers, cords (wash, steam)', score: 3, isKey: true, details: [], comment: '预防做到衣服上起皱，起浪等问题', commentEn: 'Prevent wrinkles and ripples on garments' },
        ]
      },
      '10. 辅料出库记录及盘点记录': {
        nameEn: '10. Trim Outgoing & Stock Records',
        items: [
          { id: 'm10_1', name: '① 出库记录含款号，数量，色号，时间，领料人等信息', nameEn: '① Outgoing records include style, quantity, color, time, picker, etc.', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm10_2', name: '② 盘点记录', nameEn: '② Inventory records', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm10_3', name: '③ 库存记录（保留至少1年）', nameEn: '③ Stock records (keep at least 1 year)', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'preproduction',
    name: '产前会议控制',
    nameEn: 'Pre-production Meeting Control',
    skippable: true,
    skippableLabel: '无需参与产前会议控制评分',
    skippableLabelEn: 'No need for pre-production meeting, not scored',
    subModules: {
      '1. 参会人员': {
        nameEn: '1. Participants',
        items: [
          { id: 'pp1_1', name: '① 技术部', nameEn: '① Technical Department', score: 1, isKey: false, details: [], comment: '技术部对前期开发比较了解，可以规避打样时发生的问题，更好的控制大货品质', commentEn: 'Technical Dept understands development, can prevent sample issues and better control bulk quality' },
          { id: 'pp1_2', name: '② 质检部', nameEn: '② QC Department', score: 1, isKey: false, details: [], comment: '质量部门要跟进技术部提出的问题点及大货品质', commentEn: 'QC Dept follows up on technical issues and bulk quality' },
          { id: 'pp1_3', name: '③ 业务部', nameEn: '③ Merchandising Department', score: 1, isKey: false, details: [], comment: '业务部门告知面辅料情况及订单进度', commentEn: 'Merchandising informs material situation and order progress' },
          { id: 'pp1_4', name: '④ 生产部（裁剪，生产主管，生产组长）', nameEn: '④ Production (cutting, production supervisor, line leader)', score: 1, isKey: false, details: ['无裁剪', '无生产主管', '无生产组长'], detailsEn: ['No cutting', 'No production supervisor', 'No line leader'], comment: '' },
          { id: 'pp1_5', name: '⑤ 后道（后道主管）', nameEn: '⑤ Finishing (finishing supervisor)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp1_6', name: '⑥ 二次加工产品（印花/绣花/水洗/烫钻等）各工序负责人必须参会', nameEn: '⑥ Secondary process owners (printing/embroidery/washing/rhinestone etc.) must attend', score: 1, isKey: false, details: [], comment: '二次加工负责人主要时了解二次加工的产品如何控制品质', commentEn: 'Secondary process owners mainly understand how to control quality of secondary processed products' },
        ]
      },
      '2. 工艺标准传达及预防措施': {
        nameEn: '2. Tech Standard Communication & Preventive Measures',
        items: [
          { id: 'pp2_1', name: '① 客户确认样', nameEn: '① Customer confirmed sample', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_2', name: '② 确认意见，明确客户要求', nameEn: '② Confirmation comments, clarify customer requirements', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_3', name: '③ 试生产样（客户确认码，最小码及最大码）和封样', nameEn: '③ Trial production sample (customer confirmed size, min and max sizes) and sealed sample', score: 3, isKey: true, details: ['无客户确认码', '无最大码', '无最小码', '无封样'], detailsEn: ['No customer confirmed size', 'No max size', 'No min size', 'No sealed sample'], comment: '做最小码和最大码衣服，可提前预知大货可能出现的问题', commentEn: 'Min/max size garments help predict bulk issues in advance' },
          { id: 'pp2_4_a', name: '④ 工艺单需覆盖以下内容 a. 重点工序难点（制作领子，门襟等小样）及解决方案', nameEn: '④ Tech sheet must cover: a. Key process difficulties (collar, placket samples etc.) and solutions', score: 1, isKey: false, details: [], comment: '给车间生产员工一个质量标准参照', commentEn: 'Provide quality reference for production workers' },
          { id: 'pp2_4_b', name: '⑤ 工艺单需覆盖以下内容 b. 试生产样的外观/尺寸/克重/试身的问题及解决方案', nameEn: '⑤ Tech sheet must cover: b. Trial sample appearance/size/weight/fitting issues and solutions', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_c', name: '⑥ 工艺单需覆盖以下内容 c. 对条对格，花型定位等要求', nameEn: '⑥ Tech sheet must cover: c. Stripe/pattern matching and positioning requirements', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_d', name: '⑦ 工艺单需覆盖以下内容 d. 特别关注撕裂强度的缝制工艺的风险', nameEn: '⑦ Tech sheet must cover: d. Special attention to sewing process risks affecting tear strength', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_e', name: '⑧ 工艺单需覆盖以下内容 e. 特别关注粘衬环节的风险（颜色差异，透胶，粘衬颜色）', nameEn: '⑧ Tech sheet must cover: e. Special attention to fusing risks (color difference, glue bleed, fusing color)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_f', name: '⑨ 工艺单需覆盖以下内容 f. 轻薄产品包装方法风险评估（皱，滑落等）', nameEn: '⑨ Tech sheet must cover: f. Risk assessment of packaging methods for lightweight products (wrinkles, slipping, etc.)', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 技术难点分析': {
        nameEn: '3. Technical Difficulty Analysis',
        items: [
          { id: 'pp3_1', name: '① 提出相应的改进建议', nameEn: '① Propose improvement suggestions', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp3_2', name: '② 明确跟进人员及负责人', nameEn: '② Clarify follow-up personnel and responsible persons', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '4. 会议记录执行': {
        nameEn: '4. Meeting Records Execution',
        items: [
          { id: 'pp4_1', name: '① 会议记录完整，参会人员签字确认', nameEn: '① Complete meeting records with participant signatures', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp4_2', name: '② 会议记录随工艺单确认样一起流转至生产各部门', nameEn: '② Meeting records circulate to all production departments along with tech sheet and confirmed samples', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'cutting',
    name: '裁剪品质控制',
    nameEn: 'Cutting Quality Control',
    skippable: true,
    skippableLabel: '无需参与裁剪品质控制评分',
    skippableLabelEn: 'No need for cutting QC, not scored',
    subModules: {
      '1. 面料松布': {
        nameEn: '1. Fabric Relaxation',
        items: [
          { id: 'c1_1', name: '① 面料不可捆扎', nameEn: '① Fabric should not be bundled', score: 1, isKey: false, details: [], comment: '放缩后困扎面料，会影响面料的回缩', commentEn: 'Bundling after relaxation affects fabric relaxation' },
          { id: 'c1_2', name: '② 面料不可多卷混放', nameEn: '② Multiple rolls should not be mixed', score: 1, isKey: false, details: [], comment: '多卷放在一起，会影响压在下方面料的回缩，敏感面料会产生压痕', commentEn: 'Multiple rolls stacked together affects relaxation of bottom rolls, sensitive fabric may get pressure marks' },
          { id: 'c1_3', name: '③ 面料不可落地摆放', nameEn: '③ Fabric should not be placed on the ground', score: 1, isKey: false, details: [], comment: '预防脏污，潮湿等问题', commentEn: 'Prevent dirt, moisture issues' },
          { id: 'c1_4', name: '④ 现场标识清晰（订单号，缸号/卷号，开始及结束时间）', nameEn: '④ Clear on-site labels (order no., lot/roll no., start/end time)', score: 3, isKey: true, details: ['订单号标识不清晰', '缸号/卷号不清晰', '开始及结束时间不清晰'], detailsEn: ['Unclear order no.', 'Unclear lot/roll no.', 'Unclear start/end time'], comment: '' },
        ]
      },
      '2. 待裁': {
        nameEn: '2. Pre-cutting',
        items: [
          { id: 'c2_1', name: '① 复核面料测试报告，松布时效', nameEn: '① Re-verify fabric test report, relaxation time', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c2_2', name: '② 裁剪计划单及签字', nameEn: '② Cutting plan and signature', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c2_3', name: '③ 唛架的核对（是否缺失，对码）', nameEn: '③ Marker verification (missing, size matching)', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 铺布': {
        nameEn: '3. Spreading',
        items: [
          { id: 'c3_1', name: '① 确认铺布方式（单向/双向/定位），确保一件一方向', nameEn: '① Confirm spreading method (one-way/two-way/positioning), ensure one piece one direction', score: 1, isKey: false, details: [], comment: '预防大货有色差，色光', commentEn: 'Prevent bulk color/shade difference' },
          { id: 'c3_2', name: '② 要求面料平整，无褶皱，无拉伸变形，无纬斜，且布边对齐', nameEn: '② Fabric should be flat, no wrinkles, no stretching deformation, no skew, edges aligned', score: 1, isKey: false, details: ['面料不平整有褶皱', '拉伸变形', '纬斜', '布边未对齐'], detailsEn: ['Uneven with wrinkles', 'Stretching deformation', 'Skew', 'Edges not aligned'], comment: '' },
          { id: 'c3_3', name: '③ 铺布层数（50-80层）薄料高度<5cm，其他面料最高不能超过12cm（自动裁床根据裁床限定高度）', nameEn: '③ Spreading layers (50-80 layers) thin fabric <5cm height, other max 12cm (auto cutter per limit)', score: 1, isKey: false, details: [], comment: '控制裁片的精准度，（层高太高容易偏刀，尺寸控制不准确）', commentEn: 'Control cutting precision (too high causes knife deviation and inaccurate size)' },
          { id: 'c3_4', name: '④ 每卷面料需要用隔层纸或面料隔开', nameEn: '④ Each fabric roll needs separator paper or fabric', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c3_5', name: '⑤ 弹力面料铺布后须静置2小时', nameEn: '⑤ Stretch fabric should rest 2 hours after spreading', score: 3, isKey: true, details: [], comment: '以防铺布时把面料拉伸', commentEn: 'Prevent stretching during spreading' },
          { id: 'c3_6', name: '⑥ 铺布完成后用夹子四周固定，中间用重物压实（自动裁床除外）', nameEn: '⑥ After spreading, fix with clips around edges, weigh down middle (auto cutter excluded)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c3_7', name: '⑦ 剩余面料布头需标识清晰以备换片', nameEn: '⑦ Remaining fabric pieces should be clearly labeled for piece replacement', score: 1, isKey: false, details: [], comment: '控制换片导致色差', commentEn: 'Control color difference from piece replacement' },
        ]
      },
      '4. 裁片': {
        nameEn: '4. Cut Pieces',
        items: [
          { id: 'c4_1', name: '① 裁片大小的复核（上中下各3片）', nameEn: '① Cut piece size verification (3 pieces top, middle, bottom)', score: 3, isKey: true, details: [], comment: '复核裁片的精准度', commentEn: 'Verify cutting precision' },
          { id: 'c4_2', name: '② 验片外观（布疵，勾丝，污渍，印花等）', nameEn: '② Piece appearance inspection (fabric defects, snags, stains, prints)', score: 3, isKey: true, details: [], comment: '' },
          { id: 'c4_3', name: '③ 编号', nameEn: '③ Numbering', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c4_4', name: '④ 用捆扎绳卷筒式捆扎（捆扎绳有裁片信息：款号，分包号，件数，缸号，尺码等）', nameEn: '④ Roll-style bundling (bundling rope has piece info: style, sub-package, quantity, lot, size)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c4_5', name: '⑤ 分码分色存放（浅色需覆盖分开放置），禁止落地', nameEn: '⑤ Sort by size and color (light colors need cover separation), no ground storage', score: 1, isKey: false, details: ['裁片未分码分色存放', '裁片落地'], detailsEn: ['Not sorted by size/color', 'Pieces on ground'], comment: '预防沾色，脏污等', commentEn: 'Prevent staining, dirt' },
        ]
      },
      '5. 粘衬': {
        nameEn: '5. Fusing',
        items: [
          { id: 'c5_1', name: '① 粘衬机清洁和机器维护', nameEn: '① Fusing machine cleaning and maintenance', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_2', name: '② 粘衬机参数（衬厂提供）和工艺单吻合', nameEn: '② Fusing machine parameters (from interlining supplier) match tech sheet', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_3', name: '③ 粘衬丝缕方向同面料丝缕方向', nameEn: '③ Fusing grain direction matches fabric grain direction', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_4', name: '④ 入粘衬机时按丝缕方向送入', nameEn: '④ Feed into fusing machine along grain direction', score: 1, isKey: false, details: [], comment: '预防裁片粘衬后变形', commentEn: 'Prevent piece deformation after fusing' },
          { id: 'c5_5', name: '⑤ 首批粘衬的裁片，需做剥离测试，是否透胶等评估风险（如有问题，立即会报裁剪主管跟进解决）', nameEn: '⑤ First batch of fused pieces need peel test, glue bleed risk assessment (report issues immediately)', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'sewing',
    name: '缝制工艺品质控制',
    nameEn: 'Sewing Process Quality Control',
    skippable: true,
    skippableLabel: '无需参与缝制工艺品质控制评分',
    skippableLabelEn: 'No need for sewing QC, not scored',
    subModules: {
      '1. 缝制设备/特种设备': {
        nameEn: '1. Sewing Equipment / Special Equipment',
        items: [
          { id: 's1_1', name: '① 定期维护保养记录', nameEn: '① Regular maintenance records', score: 1, isKey: false, details: [], comment: '' },
          { id: 's1_2', name: '② 压脚类型与面料是否匹配', nameEn: '② Presser foot type matches fabric', score: 1, isKey: false, details: [], comment: '控制缝制起皱，磨破面料等问题', commentEn: 'Control sewing wrinkles, fabric damage' },
          { id: 's1_3', name: '③ 针距/针型号是否匹配', nameEn: '③ Stitch length/needle type matches', score: 1, isKey: false, details: [], comment: '' },
          { id: 's1_4', name: '④ 缝纫线硅油用量及线迹张力核查（线迹平整度等）', nameEn: '④ Sewing thread silicone amount and stitch tension check (stitch flatness)', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '2. 点位及小烫': {
        nameEn: '2. Marking & Light Ironing',
        items: [
          { id: 's2_1', name: '① 点位工序要点 a. 禁止使用高温消色笔', nameEn: '① Marking process: a. No high-temp disappearing pen', score: 3, isKey: true, details: [], comment: '高温消色笔在低温（零下）会显现出来', commentEn: 'High-temp disappearing pen appears at low temperature (below zero)' },
          { id: 's2_2', name: '② 点位工序要点 b. 核查丝缕方向是否与纸样标注的方向一致', nameEn: '② Marking process: b. Verify grain direction matches pattern mark', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_3', name: '③ 点位工序要点 c. 点位前确保裁片和纸样吻合，避免偏移', nameEn: '③ Marking process: c. Ensure piece matches pattern before marking, avoid offset', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_4', name: '④ 小烫工序要点 a. 烫台用白布包裹及台面干净整洁，定期更换', nameEn: '④ Light ironing: a. Ironing board wrapped with white cloth, clean surface, replace regularly', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_5', name: '⑤ 小烫工序要点 b.烫斗温度和面料匹配（建议真丝面料低于110度）', nameEn: '⑤ Light ironing: b. Iron temperature matches fabric (silk suggested below 110°C)', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_6', name: '⑥ 小烫工序要点 c.烫工的操作手法是否正确（见指南）', nameEn: '⑥ Light ironing: c. Ironing technique correct (see guide)', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_7', name: '⑦ 查验 a. 查验是否有激光印/透胶', nameEn: '⑦ Inspection: a. Check for laser marks/glue bleed', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_8', name: '⑧ 查验 b. 查验是否变型/变色', nameEn: '⑧ Inspection: b. Check for deformation/color change', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_9', name: '⑨ 查验 c. 查验粘衬牢固度', nameEn: '⑨ Inspection: c. Check fusing bond strength', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 缝制中': {
        nameEn: '3. During Sewing',
        items: [
          { id: 's3_1', name: '① 重点工序悬挂指示牌及标准小样（领子，口袋，门襟，袖口等）', nameEn: '① Key process hanging signs and standard samples (collar, pocket, placket, cuff)', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_2', name: '② 重点工序是否有辅助工具提高质量稳定性（压脚，鱼骨，模版等）', nameEn: '② Key process has auxiliary tools for quality stability (presser foot, bone, template)', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_3', name: '③ 现场是否有首件样及资料（工艺单，辅料卡，产前会议记录等）', nameEn: '③ First-piece sample and documents on site (tech sheet, trim card, PP meeting record)', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_4', name: '④ 线上车工技能评估（半成品的质量-皱/对称等）', nameEn: '④ Operator skill assessment (semi-finished quality - wrinkles/symmetry)', score: 3, isKey: true, details: [], comment: '' },
          { id: 's3_5', name: '⑤ 巡检是否定时巡查重点工序质量', nameEn: '⑤ Patrol inspection on key process quality at intervals', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_6', name: '⑥ 线头是否随做随剪', nameEn: '⑥ Trim threads as you go', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_7', name: '⑦ 半成品不可捆扎过紧，避免褶皱', nameEn: '⑦ Semi-finished not bundled too tight, avoid wrinkles', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_8', name: '⑧ 流转箱用布包裹，半成品分色分码区分', nameEn: '⑧ Transfer boxes wrapped with cloth, semi-finished sorted by color and size', score: 1, isKey: false, details: [], comment: '预防半成品衣服在流转过程中勾纱，脏污', commentEn: 'Prevent snags, dirt on semi-finished garments in transit' },
        ]
      },
      '4. 线上检验': {
        nameEn: '4. Inline Inspection',
        items: [
          { id: 's4_1', name: '① 尺寸检验 每色每码 >10% 并记录', nameEn: '① Size inspection: >10% per color/size, with records', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_2', name: '② 外观检验 每色每码 > 10% 并记录', nameEn: '② Appearance inspection: >10% per color/size, with records', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_3', name: '③ 试身小中大码和封样/首件样 对比外观及功能性（特别是重点工序），并记录', nameEn: '③ Try-on S/M/L vs sealed/first-piece sample (appearance and function, especially key process), recorded', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_4', name: '④ 中检合格品/非合格品分开摆放', nameEn: '④ Mid-inspection pass/fail placed separately', score: 1, isKey: false, details: [], comment: '' },
          { id: 's4_5', name: '⑤ 不合格品需立即退回对应工序翻修，并有组长跟进', nameEn: '⑤ Failures must be returned to corresponding process for rework, group leader follows up', score: 1, isKey: false, details: [], comment: '' },
          { id: 's4_6', name: '⑥ 中检检验按工序记录疵点类型及比例，以便车工技能提升', nameEn: '⑥ Mid-inspection records defect types and ratios by process for operator skill improvement', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '5. 唛头': {
        nameEn: '5. Labels',
        items: [
          { id: 's5_1', name: '① 按裁剪数量尺码数领取主标，尺码表，洗标', nameEn: '① Collect main label, size label, care label by cut quantity and size', score: 1, isKey: false, details: [], comment: '' },
          { id: 's5_2', name: '② 尺码表，洗标顺序不可错乱，以阅读方向缝制', nameEn: '② Size and care label order not confused, sew in reading direction', score: 1, isKey: false, details: [], comment: '' },
          { id: 's5_3', name: '③ 一码一清，一款一清，如有剩余唛头，需追溯原因，并有组长跟进解决', nameEn: '③ One size one clear, one style one clear, trace remaining labels with group leader', score: 1, isKey: false, details: [], comment: '预防大货衣服错码', commentEn: 'Prevent bulk garment size errors' },
        ]
      }
    }
  },
  {
    id: 'finishing',
    name: '后道品质控制',
    nameEn: 'Finishing Quality Control',
    skippable: true,
    skippableLabel: '无需参与后道品质控制评分',
    skippableLabelEn: 'No need for finishing QC, not scored',
    subModules: {
      '1. 后道区域': {
        nameEn: '1. Finishing Area',
        items: [
          { id: 'f1_1', name: '① 后道区域划分明确，并有清晰标识', nameEn: '① Finishing area clearly divided with clear signs', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f1_2', name: '② 中转箱需要明确标识', nameEn: '② Transfer boxes need clear signs', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f1_3', name: '③ 样衣和资料悬挂在后道区域', nameEn: '③ Sample garments and documents hung in finishing area', score: 1, isKey: false, details: [], comment: '供后道核对品质和尺寸等', commentEn: 'For finishing QC to verify quality and size' },
        ]
      },
      '2. 锁眼钉扣': {
        nameEn: '2. Buttonhole & Button',
        items: [
          { id: 'f2_1', name: '① 按纸样点位，（禁止使用高温消色笔）', nameEn: '① Per pattern position (no high-temp disappearing pen)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f2_2', name: '② 每码一纸样，标识对应尺码', nameEn: '② One pattern per size, mark corresponding size', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f2_3', name: '③ 核对锁眼纽扣的大小，位置；钉扣的牢度和纽扣的吻合度；锁眼线迹需干净整洁', nameEn: '③ Verify buttonhole/button size, position; button attachment strength and matching; clean buttonhole stitching', score: 1, isKey: false, details: ['大小/位置', '牢度和吻合度', '线迹不干净整洁'], detailsEn: ['Size/position', 'Strength and matching', 'Stitching not clean'], comment: '' },
          { id: 'f2_4', name: '④ 核查功能性', nameEn: '④ Verify functionality', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 整烫': {
        nameEn: '3. Ironing',
        items: [
          { id: 'f3_1', name: '① 是否有摇臂烫台（胸省，袖笼等）', nameEn: '① Has swivel ironing board (chest dart, armhole, etc.)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f3_2', name: '② 是否过度压烫，是否有激光印', nameEn: '② Excessive ironing, laser marks', score: 1, isKey: false, details: ['过度压烫', '有激光印'], detailsEn: ['Excessive ironing', 'Laser marks'], comment: '' },
          { id: 'f3_3', name: '③ 整烫后合理放置（轻薄款建议悬挂防皱）', nameEn: '③ Proper placement after ironing (light items suggest hanging to prevent wrinkles)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f3_4', name: '④ 平放不易过高，底层不可以明显褶皱', nameEn: '④ Flat stack not too high, bottom layer no obvious wrinkles', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '4. 总检': {
        nameEn: '4. Final Inspection',
        items: [
          { id: 'f4_1', name: '① 检验区域光源不得低于750LUX，温湿度计及记录（室内湿度超过65%，关注产品潮湿度）', nameEn: '① Inspection area light ≥750LUX, hygrometer and records (humidity >65% watch product moisture)', score: 1, isKey: false, details: ['光源低于750LUX', '无温湿度计及记录'], detailsEn: ['Light <750LUX', 'No hygrometer/records'], comment: '' },
          { id: 'f4_2', name: '② 按码数100%检验（尺寸，标，外观，功能，湿度，试身效果等），后道主管/质量经理需抽查合格品（建议抽查每人员5%）', nameEn: '② 100% inspection by size (size, label, appearance, function, humidity, try-on etc.), finishing supervisor/QC manager spot-checks (suggest 5%)', score: 3, isKey: true, details: ['未按码数100%检验', '未按要求抽查'], detailsEn: ['No 100% inspection', 'No spot-check'], comment: '' },
          { id: 'f4_3', name: '③ 疵点问题需清晰标识', nameEn: '③ Defects clearly marked', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_4', name: '④ 待检品/合格品/不合格品分开放置', nameEn: '④ Pending/Pass/Fail placed separately', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_5', name: '⑤ 污渍清理需在指定区域清理（确保返工后无水印，无变色，无异味）', nameEn: '⑤ Stain cleaning in designated area (no watermark, discoloration, odor after rework)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_6', name: '⑥ 总检跟踪翻修品，当天款当天结束', nameEn: '⑥ Final inspection tracks rework, complete same day', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_7', name: '⑦ 总检汇总100%检验记录（报告）和疵点问题（建议汇总次品率），并反馈生产部门改进', nameEn: '⑦ Final inspection summarizes 100% records (report) and defects (suggest reject rate), feedback to production for improvement', score: 3, isKey: true, details: [], comment: '后续提升大货的品质的依据', commentEn: 'Basis for subsequent bulk quality improvement' },
        ]
      },
      '5. 包装': {
        nameEn: '5. Packaging',
        items: [
          { id: 'f5_1', name: '① 是否有标准包装样', nameEn: '① Has standard packaging sample', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_2', name: '② 分色分码分区包装（潮湿度需达到客户要求）', nameEn: '② Sort by color/size in packaging (humidity meet customer requirement)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_3', name: '③ 胶袋贴纸和裁剪数尺码吻合，一码一清，分码入筐', nameEn: '③ Polybag labels match cut qty and size, one size one clear, separate baskets', score: 3, isKey: true, details: [], comment: '预防包装错码', commentEn: 'Prevent wrong size packaging' },
          { id: 'f5_4', name: '④ 一款一清，如有剩余贴纸，需追溯原因，并由组长跟进解决', nameEn: '④ One style one clear, trace remaining labels, group leader follows up', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_5', name: '⑤ 9点测试记录及检针报告', nameEn: '⑤ 9-point test records and needle detection report', score: 1, isKey: false, details: [], comment: '控制衣服内的金属和安全性', commentEn: 'Control metal in garments and safety' },
        ]
      },
      '6. 装箱': {
        nameEn: '6. Carton Packing',
        items: [
          { id: 'f6_1', name: '① 按装箱单装箱（业务部门评估复核）', nameEn: '① Pack per packing list (merchandising reviews)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f6_2', name: '② 纸箱尺寸和质量是否按客人要求', nameEn: '② Carton size and quality per customer requirement', score: 1, isKey: false, details: ['尺寸不符合要求', '质量不符合要求'], detailsEn: ['Size not meeting requirement', 'Quality not meeting requirement'], comment: '' },
          { id: 'f6_3', name: '③ 纸箱外观（不可鼓箱，不可超重，不可空箱）', nameEn: '③ Carton appearance (no bulging, overweight, empty)', score: 1, isKey: false, details: ['鼓箱', '超重', '空箱'], detailsEn: ['Bulging', 'Overweight', 'Empty'], comment: '' },
          { id: 'f6_4', name: '④ 箱唛贴纸信息核对，里外一致（与箱单/订单）', nameEn: '④ Carton label info verify, inside/outside consistent (vs packing list/order)', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'quality',
    name: '质量部门品质控制',
    nameEn: 'QC Department Quality Control',
    skippable: true,
    skippableLabel: '无需参与质量部门品质控制评分',
    skippableLabelEn: 'No need for QC Department QC, not scored',
    subModules: {
      '1. AQL抽检': {
        nameEn: '1. AQL Sampling',
        items: [
          { id: 'q1_1', name: '① 按AQL4.0/L2检验', nameEn: '① AQL 4.0/L2 inspection', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'other',
    name: '其他评分',
    nameEn: 'Other Ratings',
    skippable: true,
    skippableLabel: '无需参与其他评分',
    skippableLabelEn: 'No need for other ratings, not scored',
    subModules: {
      '1. Dummy': {
        nameEn: '1. Dummy',
        items: [
          { id: 'o1_1', name: '① 是否有标准Dummy', nameEn: '① Has standard dummy', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '2. 利器管控': {
        nameEn: '2. Sharp Tool Control',
        items: [
          { id: 'o2_1', name: '① 是否专人专管（如裁剪刀等）', nameEn: '① Designated person management (e.g. cutting knives)', score: 1, isKey: false, details: [], comment: '' },
          { id: 'o2_2', name: '② 是否有完整的换针记录', nameEn: '② Complete needle change records', score: 1, isKey: false, details: [], comment: '' },
          { id: 'o2_3', name: '③ 小剪刀等是否捆绑固定', nameEn: '③ Small scissors bundled and fixed', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 其他': {
        nameEn: '3. Other',
        items: [
          { id: 'o3_1', name: '① 个人生活物品食物等禁止出现在生产区域', nameEn: '① Personal items/food prohibited in production area', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  }
];

export const TOTAL_SCORE = 177;
