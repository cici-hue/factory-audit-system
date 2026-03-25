import { AuditModule } from '../types';

export const auditModules: AuditModule[] = [
  {
    id: 'pattern',
    name: '纸样、样衣制作',
    subModules: {
      '1. 纸样开发标准': {
        items: [
          { id: 'p1_1', name: '① 使用CAD软件制作/修改纸样', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_2', name: '② 缝份清晰标记应合规', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_3', name: '③ 布纹线，剪口标注合规并清晰', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_4', name: '④ 放码标准（尺寸增量）遵守客户要求，并文档化', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p1_5', name: '⑤ 技术包（Tech Pack）应明确标注尺寸表、工艺说明与要求，及特殊工艺说明（尤其是特殊面料或设计）', score: 3, isKey: true, details: [], comment: '' },
        ]
      },
      '2. 版本控制与追溯性': {
        items: [
          { id: 'p2_1', name: '① 纸样版本控制系统（确保最新、准确、可追溯）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p2_2', name: '② 文档记录：纸样历史、修订、批准', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p2_3', name: '③ 物理纸样（平放/悬挂）及数字备份的安全存储', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 初版审核与文档化': {
        items: [
          { id: 'p3_1', name: '① 尺寸与工艺审核，应符合技术包要求（检验记录）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'p3_2', name: '② 面辅料核对，并按要求进行功能性检测（检验记录）', score: 3, isKey: true, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'fabric',
    name: '面辅料品质控制',
    subModules: {
      '1. 面料仓库检查': {
        items: [
          { id: 'm1_1', name: '① 合格/不合格品/待检标识应明确，分开堆放', score: 1, isKey: false, details: ['标识不明确', '未分开堆放'], comment: '' },
          { id: 'm1_2', name: '② 面料不可"井"字堆放，高度不可过高（建议<1.5m）（针织面料除外）', score: 1, isKey: false, details: ['面料井字堆放', '堆放高度过高'], comment: '' },
          { id: 'm1_3', name: '③ 不同颜色及批次（缸号）分开堆放', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm1_4', name: '④ 托盘存放不靠墙、不靠窗、避光储存及防潮防霉', score: 1, isKey: false, details: ['靠墙', '靠窗', '未避光储存', '未防潮防霉'], comment: '' },
          { id: 'm1_5', name: '⑤ 温湿度计及记录（湿度<65%）', score: 1, isKey: false, details: [], comment: '监控湿度的变化，便于采取相应的解决方案（如抽湿）' },
        ]
      },
      '2. 面料入库记录': {
        items: [
          { id: 'm2_1', name: '① 面料厂验布记录/测试记录/缸差布', score: 1, isKey: false, details: ['无验布记录', '无测试记录', '无缸差布'], comment: '测试记录和缸差布可预防面料品质问题和色差问题' },
          { id: 'm2_2', name: '② 入库单（卷数，米数，克重等）', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 面料检验（织成试样检验）': {
        items: [
          { id: 'm3_1', name: '① 四分制验布及现场演示', score: 1, isKey: false, details: ['无记录', '现场工人操作不规范'], comment: '' },
          { id: 'm3_2', name: '② 500m以下全检，500m以上至少抽检10%（覆盖每缸）', score: 3, isKey: true, details: ['500m以下未全检', '500m以上抽检不足10%'], comment: '' },
          { id: 'm3_3', name: '③ 核对面料厂缸差布和大货面料（颜色D65，克重，防静电）', score: 1, isKey: false, details: [], comment: '缸差核对要在灯箱里进行，灯光要用D65光源' },
        ]
      },
      '4. 面料测试': {
        items: [
          { id: 'm4_1', name: '① 每缸测试记录（如水洗色牢度，干湿色牢度，PH值）', score: 1, isKey: false, details: [], comment: '可以控制大货的色牢度，沾色等问题' },
        ]
      },
      '5. 预缩记录和结果': {
        items: [
          { id: 'm5_1', name: '① 面料缩率要求 ≤ 3%（水洗针织款除外）', score: 3, isKey: true, details: [], comment: '面料缩率大于3%时，成衣工厂的尺寸控制难度较大' },
          { id: 'm5_2', name: '② 每缸缩率记录', score: 3, isKey: true, details: [], comment: '每缸缩率测试可以更好的控制大货成衣尺寸（纸版可以进行放缩率）' },
        ]
      },
      '6. 面料出库记录及盘点记录': {
        items: [
          { id: 'm6_1', name: '① 出库记录含款号，缸号，米数，色号，时间，领料人等信息', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm6_2', name: '② 盘点记录', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm6_3', name: '③ 库存1年以上面料不可使用', score: 1, isKey: false, details: [], comment: '盘点一年以上的库存面料禁止使用（成衣撕裂牢度等会受影响）' },
        ]
      },
      '7. 辅料仓库检查': {
        items: [
          { id: 'm7_1', name: '① 辅料存放标识明确（订单/款号/色号，分类堆放）', score: 1, isKey: false, details: ['订单/款号/色号标识不清晰', '分类堆放标识不清晰'], comment: '以防辅料发放错款' },
          { id: 'm7_2', name: '② 辅料入库记录（品类，数量）', score: 1, isKey: false, details: ['无品类记录', '无数量记录'], comment: '' },
        ]
      },
      '8. 辅料检验': {
        items: [
          { id: 'm8_1', name: '① 正确辅料卡核对（型号，颜色，功能，内容，外观）', score: 1, isKey: false, details: ['无型号', '无颜色', '无功能', '无内容', '无外观'], comment: '' },
        ]
      },
      '9. 辅料测试': {
        items: [
          { id: 'm9_1', name: '① 织带，橡筋，拉链，绳子的预缩测试（水洗缩，烫蒸缩）', score: 3, isKey: true, details: [], comment: '预防做到衣服上起皱，起浪等问题' },
        ]
      },
      '10. 辅料出库记录及盘点记录': {
        items: [
          { id: 'm10_1', name: '① 出库记录含款号，数量，色号，时间，领料人等信息', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm10_2', name: '② 盘点记录', score: 1, isKey: false, details: [], comment: '' },
          { id: 'm10_3', name: '③ 库存记录（保留至少1年）', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'preproduction',
    name: '产前会议控制',
    subModules: {
      '1. 参会人员': {
        items: [
          { id: 'pp1_1', name: '① 技术部', score: 1, isKey: false, details: [], comment: '技术部对前期开发比较了解，可以规避打样时发生的问题，更好的控制大货品质' },
          { id: 'pp1_2', name: '② 质检部', score: 1, isKey: false, details: [], comment: '质量部门要跟进技术部提出的问题点及大货品质' },
          { id: 'pp1_3', name: '③ 业务部', score: 1, isKey: false, details: [], comment: '业务部门告知面辅料情况及订单进度' },
          { id: 'pp1_4', name: '④ 生产部（裁剪，生产主管，生产组长）', score: 1, isKey: false, details: ['无裁剪', '无生产主管', '无生产组长'], comment: '' },
          { id: 'pp1_5', name: '⑤ 后道（后道主管）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp1_6', name: '⑥ 二次加工产品（印花/绣花/水洗/烫钻等）各工序负责人必须参会', score: 1, isKey: false, details: [], comment: '二次加工负责人主要时了解二次加工的产品如何控制品质' },
        ]
      },
      '2. 工艺标准传达及预防措施': {
        items: [
          { id: 'pp2_1', name: '① 客户确认样', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_2', name: '② 确认意见，明确客户要求', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_3', name: '③ 试生产样（客户确认码，最小码及最大码）和封样', score: 3, isKey: true, details: ['无客户确认码', '无最大码', '无最小码', '无封样'], comment: '做最小码和最大码衣服，可提前预知大货可能出现的问题' },
          { id: 'pp2_4_a', name: '④ 工艺单需覆盖以下内容 a. 重点工序难点（制作领子，门襟等小样）及解决方案', score: 1, isKey: false, details: [], comment: '给车间生产员工一个质量标准参照' },
          { id: 'pp2_4_b', name: '⑤ 工艺单需覆盖以下内容 b. 试生产样的外观/尺寸/克重/试身的问题及解决方案', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_c', name: '⑥ 工艺单需覆盖以下内容 c. 对条对格，花型定位等要求', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_d', name: '⑦ 工艺单需覆盖以下内容 d. 特别关注撕裂强度的缝制工艺的风险', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_e', name: '⑧ 工艺单需覆盖以下内容 e. 特别关注粘衬环节的风险（颜色差异，透胶，粘衬颜色）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp2_4_f', name: '⑨ 工艺单需覆盖以下内容 f. 轻薄产品包装方法风险评估（皱，滑落等）', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 技术难点分析': {
        items: [
          { id: 'pp3_1', name: '① 提出相应的改进建议', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp3_2', name: '② 明确跟进人员及负责人', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '4. 会议记录执行': {
        items: [
          { id: 'pp4_1', name: '① 会议记录完整，参会人员签字确认', score: 1, isKey: false, details: [], comment: '' },
          { id: 'pp4_2', name: '② 会议记录随工艺单确认样一起流转至生产各部门', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'cutting',
    name: '裁剪品质控制',
    subModules: {
      '1. 面料松布': {
        items: [
          { id: 'c1_1', name: '① 面料不可捆扎', score: 1, isKey: false, details: [], comment: '放缩后困扎面料，会影响面料的回缩' },
          { id: 'c1_2', name: '② 面料不可多卷混放', score: 1, isKey: false, details: [], comment: '多卷放在一起，会影响压在下方面料的回缩，敏感面料会产生压痕' },
          { id: 'c1_3', name: '③ 面料不可落地摆放', score: 1, isKey: false, details: [], comment: '预防脏污，潮湿等问题' },
          { id: 'c1_4', name: '④ 现场标识清晰（订单号，缸号/卷号，开始及结束时间）', score: 3, isKey: true, details: ['订单号标识不清晰', '缸号/卷号不清晰', '开始及结束时间不清晰'], comment: '' },
        ]
      },
      '2. 待裁': {
        items: [
          { id: 'c2_1', name: '① 复核面料测试报告，松布时效', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c2_2', name: '② 裁剪计划单及签字', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c2_3', name: '③ 唛架的核对（是否缺失，对码）', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 铺布': {
        items: [
          { id: 'c3_1', name: '① 确认铺布方式（单向/双向/定位），确保一件一方向', score: 1, isKey: false, details: [], comment: '预防大货有色差，色光' },
          { id: 'c3_2', name: '② 要求面料平整，无褶皱，无拉伸变形，无纬斜，且布边对齐', score: 1, isKey: false, details: ['面料不平整有褶皱', '拉伸变形', '纬斜', '布边未对齐'], comment: '' },
          { id: 'c3_3', name: '③ 铺布层数（50-80层）薄料高度<5cm，其他面料最高不能超过12cm（自动裁床根据裁床限定高度）', score: 1, isKey: false, details: [], comment: '控制裁片的精准度，（层高太高容易偏刀，尺寸控制不准确）' },
          { id: 'c3_4', name: '④ 每卷面料需要用隔层纸或面料隔开', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c3_5', name: '⑤ 弹力面料铺布后须静置2小时', score: 3, isKey: true, details: [], comment: '以防铺布时把面料拉伸' },
          { id: 'c3_6', name: '⑥ 铺布完成后用夹子四周固定，中间用重物压实（自动裁床除外）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c3_7', name: '⑦ 剩余面料布头需标识清晰以备换片', score: 1, isKey: false, details: [], comment: '控制换片导致色差' },
        ]
      },
      '4. 裁片': {
        items: [
          { id: 'c4_1', name: '① 裁片大小的复核（上中下各3片）', score: 3, isKey: true, details: [], comment: '复核裁片的精准度' },
          { id: 'c4_2', name: '② 验片外观（布疵，勾丝，污渍，印花等）', score: 3, isKey: true, details: [], comment: '' },
          { id: 'c4_3', name: '③ 编号', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c4_4', name: '④ 用捆扎绳卷筒式捆扎（捆扎绳有裁片信息：款号，分包号，件数，缸号，尺码等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c4_5', name: '⑤ 分码分色存放（浅色需覆盖分开放置），禁止落地', score: 1, isKey: false, details: ['裁片未分码分色存放', '裁片落地'], comment: '预防沾色，脏污等' },
        ]
      },
      '5. 粘衬': {
        items: [
          { id: 'c5_1', name: '① 粘衬机清洁和机器维护', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_2', name: '② 粘衬机参数（衬厂提供）和工艺单吻合', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_3', name: '③ 粘衬丝缕方向同面料丝缕方向', score: 1, isKey: false, details: [], comment: '' },
          { id: 'c5_4', name: '④ 入粘衬机时按丝缕方向送入', score: 1, isKey: false, details: [], comment: '预防裁片粘衬后变形' },
          { id: 'c5_5', name: '⑤ 首批粘衬的裁片，需做剥离测试，是否透胶等评估风险（如有问题，立即会报裁剪主管跟进解决）', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'sewing',
    name: '缝制工艺品质控制',
    subModules: {
      '1. 缝制设备/特种设备': {
        items: [
          { id: 's1_1', name: '① 定期维护保养记录', score: 1, isKey: false, details: [], comment: '' },
          { id: 's1_2', name: '② 压脚类型与面料是否匹配', score: 1, isKey: false, details: [], comment: '控制缝制起皱，磨破面料等问题' },
          { id: 's1_3', name: '③ 针距/针型号是否匹配', score: 1, isKey: false, details: [], comment: '' },
          { id: 's1_4', name: '④ 缝纫线硅油用量及线迹张力核查（线迹平整度等）', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '2. 点位及小烫': {
        items: [
          { id: 's2_1', name: '① 点位工序要点 a. 禁止使用高温消色笔', score: 3, isKey: true, details: [], comment: '高温消色笔在低温（零下）会显现出来' },
          { id: 's2_2', name: '② 点位工序要点 b. 核查丝缕方向是否与纸样标注的方向一致', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_3', name: '③ 点位工序要点 c. 点位前确保裁片和纸样吻合，避免偏移', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_4', name: '④ 小烫工序要点 a. 烫台用白布包裹及台面干净整洁，定期更换', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_5', name: '⑤ 小烫工序要点 b.烫斗温度和面料匹配（建议真丝面料低于110度）', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_6', name: '⑥ 小烫工序要点 c.烫工的操作手法是否正确（见指南）', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_7', name: '⑦ 查验 a. 查验是否有激光印/透胶', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_8', name: '⑧ 查验 b. 查验是否变型/变色', score: 1, isKey: false, details: [], comment: '' },
          { id: 's2_9', name: '⑨ 查验 c. 查验粘衬牢固度', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 缝制中': {
        items: [
          { id: 's3_1', name: '① 重点工序悬挂指示牌及标准小样（领子，口袋，门襟，袖口等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_2', name: '② 重点工序是否有辅助工具提高质量稳定性（压脚，鱼骨，模版等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_3', name: '③ 现场是否有首件样及资料（工艺单，辅料卡，产前会议记录等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_4', name: '④ 线上车工技能评估（半成品的质量-皱/对称等）', score: 3, isKey: true, details: [], comment: '' },
          { id: 's3_5', name: '⑤ 巡检是否定时巡查重点工序质量', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_6', name: '⑥ 线头是否随做随剪', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_7', name: '⑦ 半成品不可捆扎过紧，避免褶皱', score: 1, isKey: false, details: [], comment: '' },
          { id: 's3_8', name: '⑧ 流转箱用布包裹，半成品分色分码区分', score: 1, isKey: false, details: [], comment: '预防半成品衣服在流转过程中勾纱，脏污' },
        ]
      },
      '4. 线上检验': {
        items: [
          { id: 's4_1', name: '① 尺寸检验 每色每码 >10% 并记录', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_2', name: '② 外观检验 每色每码 > 10% 并记录', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_3', name: '③ 试身小中大码和封样/首件样 对比外观及功能性（特别是重点工序），并记录', score: 3, isKey: true, details: [], comment: '' },
          { id: 's4_4', name: '④ 中检合格品/非合格品分开摆放', score: 1, isKey: false, details: [], comment: '' },
          { id: 's4_5', name: '⑤ 不合格品需立即退回对应工序翻修，并有组长跟进', score: 1, isKey: false, details: [], comment: '' },
          { id: 's4_6', name: '⑥ 中检检验按工序记录疵点类型及比例，以便车工技能提升', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '5. 唛头': {
        items: [
          { id: 's5_1', name: '① 按裁剪数量尺码数领取主标，尺码表，洗标', score: 1, isKey: false, details: [], comment: '' },
          { id: 's5_2', name: '② 尺码表，洗标顺序不可错乱，以阅读方向缝制', score: 1, isKey: false, details: [], comment: '' },
          { id: 's5_3', name: '③ 一码一清，一款一清，如有剩余唛头，需追溯原因，并有组长跟进解决', score: 1, isKey: false, details: [], comment: '预防大货衣服错码' },
        ]
      }
    }
  },
  {
    id: 'finishing',
    name: '后道品质控制',
    subModules: {
      '1. 后道区域': {
        items: [
          { id: 'f1_1', name: '① 后道区域划分明确，并有清晰标识', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f1_2', name: '② 中转箱需要明确标识', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f1_3', name: '③ 样衣和资料悬挂在后道区域', score: 1, isKey: false, details: [], comment: '供后道核对品质和尺寸等' },
        ]
      },
      '2. 锁眼钉扣': {
        items: [
          { id: 'f2_1', name: '① 按纸样点位，（禁止使用高温消色笔）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f2_2', name: '② 每码一纸样，标识对应尺码', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f2_3', name: '③ 核对锁眼纽扣的大小，位置；钉扣的牢度和纽扣的吻合度；锁眼线迹需干净整洁', score: 1, isKey: false, details: ['大小/位置', '牢度和吻合度', '线迹不干净整洁'], comment: '' },
          { id: 'f2_4', name: '④ 核查功能性', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 整烫': {
        items: [
          { id: 'f3_1', name: '① 是否有摇臂烫台（胸省，袖笼等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f3_2', name: '② 是否过度压烫，是否有激光印', score: 1, isKey: false, details: ['过度压烫', '有激光印'], comment: '' },
          { id: 'f3_3', name: '③ 整烫后合理放置（轻薄款建议悬挂防皱）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f3_4', name: '④ 平放不易过高，底层不可以明显褶皱', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '4. 总检': {
        items: [
          { id: 'f4_1', name: '① 检验区域光源不得低于750LUX，温湿度计及记录（室内湿度超过65%，关注产品潮湿度）', score: 1, isKey: false, details: ['光源低于750LUX', '无温湿度计及记录'], comment: '' },
          { id: 'f4_2', name: '② 按码数100%检验（尺寸，标，外观，功能，湿度，试身效果等），后道主管/质量经理需抽查合格品（建议抽查每人员5%）', score: 3, isKey: true, details: ['未按码数100%检验', '未按要求抽查'], comment: '' },
          { id: 'f4_3', name: '③ 疵点问题需清晰标识', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_4', name: '④ 待检品/合格品/不合格品分开放置', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_5', name: '⑤ 污渍清理需在指定区域清理（确保返工后无水印，无变色，无异味）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_6', name: '⑥ 总检跟踪翻修品，当天款当天结束', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f4_7', name: '⑦ 总检汇总100%检验记录（报告）和疵点问题（建议汇总次品率），并反馈生产部门改进', score: 3, isKey: true, details: [], comment: '后续提升大货的品质的依据' },
        ]
      },
      '5. 包装': {
        items: [
          { id: 'f5_1', name: '① 是否有标准包装样', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_2', name: '② 分色分码分区包装（潮湿度需达到客户要求）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_3', name: '③ 胶袋贴纸和裁剪数尺码吻合，一码一清，分码入筐', score: 3, isKey: true, details: [], comment: '预防包装错码' },
          { id: 'f5_4', name: '④ 一款一清，如有剩余贴纸，需追溯原因，并由组长跟进解决', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f5_5', name: '⑤ 9点测试记录及检针报告', score: 1, isKey: false, details: [], comment: '控制衣服内的金属和安全性' },
        ]
      },
      '6. 装箱': {
        items: [
          { id: 'f6_1', name: '① 按装箱单装箱（业务部门评估复核）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'f6_2', name: '② 纸箱尺寸和质量是否按客人要求', score: 1, isKey: false, details: ['尺寸不符合要求', '质量不符合要求'], comment: '' },
          { id: 'f6_3', name: '③ 纸箱外观（不可鼓箱，不可超重，不可空箱）', score: 1, isKey: false, details: ['鼓箱', '超重', '空箱'], comment: '' },
          { id: 'f6_4', name: '④ 箱唛贴纸信息核对，里外一致（与箱单/订单）', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'quality',
    name: '质量部门品质控制',
    subModules: {
      '1. AQL抽检': {
        items: [
          { id: 'q1_1', name: '① 按AQL4.0/L2检验', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  },
  {
    id: 'other',
    name: '其他评分',
    subModules: {
      '1. Dummy': {
        items: [
          { id: 'o1_1', name: '① 是否有标准Dummy', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '2. 利器管控': {
        items: [
          { id: 'o2_1', name: '① 是否专人专管（如裁剪刀等）', score: 1, isKey: false, details: [], comment: '' },
          { id: 'o2_2', name: '② 是否有完整的换针记录', score: 1, isKey: false, details: [], comment: '' },
          { id: 'o2_3', name: '③ 小剪刀等是否捆绑固定', score: 1, isKey: false, details: [], comment: '' },
        ]
      },
      '3. 其他': {
        items: [
          { id: 'o3_1', name: '① 个人生活物品食物等禁止出现在生产区域', score: 1, isKey: false, details: [], comment: '' },
        ]
      }
    }
  }
];

export const TOTAL_SCORE = 177;
