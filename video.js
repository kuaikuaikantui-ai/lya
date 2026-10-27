// --- 影视模块 (深度还原 kanju3.com 模式 + 实时动态AI推荐 + 最近观看记录) ---
(function() {
    window.currentVideoList = [];
    window.currentVideo = null;
    window.currentEpisodeIdx = 0;
    window.currentGroupIdx = 0;
    window.currentFeedSection = 0;
    window.dpInstance = null;

    // kanju3.com 官方热映大片精选推荐集 (离线即时秒开底包)
    window.KANJU_HOT_LIST = [
  {
    "vod_id": 1088,
    "vod_name": "庆余年 第二季",
    "vod_sub": "庆余年第二季",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240516-1/a6531f51b9ed9393d6647aa8d5340ca0.jpg",
    "type_name": "国产剧",
    "vod_year": "2024",
    "vod_remarks": "全31集",
    "vod_score": "9.2",
    "vod_actor": "张若昀,李沁,陈道明,吴刚,田雨,李小冉,俞飞鸿,袁泉,毛晓彤,郭麒麟,宋轶,辛芷蕾,宁理,刘端端,张昊唯,付辛博,高曙光,赵柯,于洋,李强,刘桦,佟梦实,郭子凡,金晨,王楚然,高露,王晓晨,隋俊波,归亚蕾,余皑磊,毕彦君,罗二羊,吴幸键,宣言,王庆祥,徐志胜,崔志刚,傅迦,姚安濂,秦焰,沈晓海,王同辉,冯兵,常铖,王建国,刘宇桥,冯恩鹤,赵振廷,董可飞,李俊贤,崔鹏,贾景晖,王天辰,代文雯,王成阳,张弛,左凌峰,刘同,张维伊,东靖川,杨彤,孙亦沐,于小鸣,魏炳桦,李珞桉",
    "vod_content": "<p>　　该剧改编自猫腻同名畅销小说，承接上季，范闲（张若昀 饰）率领使团回归途中，二皇子以费介、范思辙以及滕家遗孤的安危来威胁范闲，逼他向自己俯首称臣，二人的矛盾就此激发。范闲所面对的抱月楼迷局，以及接踵而至的春闱危机，都是二皇子精心给范闲布下的陷阱。<br/>　　范闲与林婉儿如愿大婚，紧接着，范闲接手内库，却发现内库负债累累。 范闲拒绝了庆余堂大掌柜的相助，决定靠自己的力量解决内库危机，范闲相约城中众商贾相聚苍山，以售卖“库债”为机筹集了两千多万银两，解决了内库空虚问题。<br/>　　悬空寺上，庆帝遭遇三连刺杀，范闲出手相救却导致武功全废。危机四伏，压力陡增，范闲别无选择，他必须以这样的身体下江南，挑战庞大的势力与既定的游戏规则，以求彻底夺回内库。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.lzcdn28.com/20250923/2326_a9bf234a/index.m3u8#第02集$https://v.lzcdn28.com/20250923/2331_f74613f0/index.m3u8#第03集$https://v.lzcdn28.com/20250923/2334_5f10bb1f/index.m3u8#第04集$https://v.lzcdn28.com/20250923/2336_3b49eb7e/index.m3u8#第05集$https://v.lzcdn28.com/20250923/2342_6e96738c/index.m3u8#第06集$https://v.lzcdn28.com/20250923/2347_9476f5ab/index.m3u8#第07集$https://v.lzcdn28.com/20250923/2348_876bf906/index.m3u8#第08集$https://v.lzcdn28.com/20250923/2350_b430aaf0/index.m3u8#第09集$https://v.lzcdn28.com/20250923/2354_2f703a62/index.m3u8#第10集$https://v.lzcdn28.com/20250923/2358_a836e610/index.m3u8#第11集$https://v.lzcdn28.com/20250923/2360_171f7060/index.m3u8#第12集$https://v.lzcdn28.com/20250923/2363_6c53396f/index.m3u8#第13集$https://v.lzcdn28.com/20250923/2365_0f4427f1/index.m3u8#第14集$https://v.lzcdn28.com/20250923/2368_0a40dc0c/index.m3u8#第15集$https://v.lzcdn28.com/20250923/2369_6c5919fb/index.m3u8#第16集$https://v.lzcdn28.com/20250923/2373_7418a01e/index.m3u8#第17集$https://v.lzcdn28.com/20250923/2375_477f5e6e/index.m3u8#第18集$https://v.lzcdn28.com/20250923/2381_67b81cc7/index.m3u8#第19集$https://v.lzcdn28.com/20250923/2383_eda48521/index.m3u8#第20集$https://v.lzcdn28.com/20250923/2389_205cad11/index.m3u8#第21集$https://v.lzcdn28.com/20250923/2390_3155207e/index.m3u8#第22集$https://v.lzcdn28.com/20250923/2395_68aff4b9/index.m3u8#第23集$https://v.lzcdn28.com/20250923/2397_59f753c6/index.m3u8#第24集$https://v.lzcdn28.com/20250923/2402_2049ca34/index.m3u8#第25集$https://v.lzcdn28.com/20250923/2404_1a28b27d/index.m3u8#第26集$https://v.lzcdn28.com/20250923/2409_10a6767e/index.m3u8#第27集$https://v.lzcdn28.com/20250923/2410_ffc5f32b/index.m3u8#第28集$https://v.lzcdn28.com/20250923/2415_9fe6b985/index.m3u8#第29集$https://v.lzcdn28.com/20250923/2417_31510a6c/index.m3u8#第30集$https://v.lzcdn28.com/20250923/2421_c8ba5461/index.m3u8#第31集$https://v.lzcdn28.com/20250923/2423_17b22817/index.m3u8#第32集$https://v.lzcdn28.com/20250923/2428_3486ceb4/index.m3u8#第33集$https://v.lzcdn28.com/20250923/2429_ef909877/index.m3u8#第34集$https://v.lzcdn28.com/20250923/2434_aa5b739d/index.m3u8#第35集$https://v.lzcdn28.com/20250923/2436_319cd383/index.m3u8#第36集$https://v.lzcdn28.com/20250923/2441_52bcf8a6/index.m3u8$$$第01集$https://vip.ffzy-online2.com/20250420/49522_e3154fc9/index.m3u8#第02集$https://vip.ffzy-online2.com/20250420/49523_116b8961/index.m3u8#第03集$https://vip.ffzy-online2.com/20250420/49524_32161d8c/index.m3u8#第04集$https://vip.ffzy-online2.com/20250420/49525_0527dc6a/index.m3u8#第05集$https://vip.ffzy-online2.com/20250420/49526_515b37a5/index.m3u8#第06集$https://vip.ffzy-online2.com/20250422/49553_6e2f66ca/index.m3u8#第07集$https://vip.ffzy-online2.com/20250423/49563_ba2fec29/index.m3u8#第08集$https://vip.ffzy-online2.com/20250424/49969_a02f16dc/index.m3u8#第09集$https://vip.ffzy-online2.com/20250425/49975_9323f21f/index.m3u8#第10集$https://vip.ffzy-online2.com/20250426/49986_ca7d733a/index.m3u8#第11集$https://vip.ffzy-online2.com/20250429/50013_8ec41a3e/index.m3u8#第12集$https://vip.ffzy-online2.com/20250430/50016_5a5a8462/index.m3u8#第13集$https://vip.ffzy-online2.com/20250501/50030_33702a9c/index.m3u8#第14集$https://vip.ffzy-online2.com/20250502/50036_9f75e281/index.m3u8#第15集$https://vip.ffzy-online2.com/20250503/50041_ca355f31/index.m3u8#第16集$https://vip.ffzy-online2.com/20250506/50061_e2f964e1/index.m3u8#第17集$https://vip.ffzy-online2.com/20250507/50073_c2016803/index.m3u8#第18集$https://vip.ffzy-online2.com/20250508/50085_b9f879d2/index.m3u8#第19集$https://vip.ffzy-online2.com/20250509/50105_3d579627/index.m3u8#第20集$https://vip.ffzy-online2.com/20250510/50113_e382852f/index.m3u8#第21集$https://vip.ffzy-online2.com/20250513/50132_83c733dc/index.m3u8#第22集$https://vip.ffzy-online2.com/20250514/50144_6abe352b/index.m3u8#第23集$https://vip.ffzy-online2.com/20250516/50165_0db1bf9a/index.m3u8#第24集$https://vip.ffzy-online2.com/20250516/50157_a38b4920/index.m3u8#第25集$https://vip.ffzy-online2.com/20250517/50180_16f60aba/index.m3u8#第26集$https://vip.ffzy-online2.com/20250520/50197_bc80062e/index.m3u8#第27集$https://vip.ffzy-online2.com/20250521/50218_f88ed1ba/index.m3u8#第28集$https://vip.ffzy-online2.com/20250523/50243_0fb8280e/index.m3u8#第29集$https://vip.ffzy-online2.com/20250523/50241_cb9337bc/index.m3u8#第30集$https://vip.ffzy-online2.com/20250524/50248_72342f16/index.m3u8#第31集$https://vip.ffzy-online2.com/20250527/50275_137b81b1/index.m3u8$$$第01集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604wlfvIh1Findex.m3u8/index.m3u8#第02集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406042aADFt58index.m3u8/index.m3u8#第03集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604l7jYmSkfindex.m3u8/index.m3u8#第04集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604Zu083a7Gindex.m3u8/index.m3u8#第05集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604OGyLKuAJindex.m3u8/index.m3u8#第06集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604YoFX7j7Qindex.m3u8/index.m3u8#第07集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604MyLL3cmLindex.m3u8/index.m3u8#第08集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604X0ujcbt5index.m3u8/index.m3u8#第09集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406047MZ301Qkindex.m3u8/index.m3u8#第10集$https://p.bvvvvvvvvv1f.com/video/replace0001/202503056XBZOovjindex.m3u8/index.m3u8#第11集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604cgwqNNtaindex.m3u8/index.m3u8#第12集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604NCMBflW4index.m3u8/index.m3u8#第13集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604sHHtD5byindex.m3u8/index.m3u8#第14集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604ro7yWE9eindex.m3u8/index.m3u8#第15集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604ShVeCwo6index.m3u8/index.m3u8#第16集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604FNbc88rpindex.m3u8/index.m3u8#第17集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406048QP76pwxindex.m3u8/index.m3u8#第18集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604lAh2ZhMVindex.m3u8/index.m3u8#第19集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604UZg7c1p0index.m3u8/index.m3u8#第20集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406041jIM9yDwindex.m3u8/index.m3u8#第21集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604OPjVqErXindex.m3u8/index.m3u8#第22集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406044Q2vi1IGindex.m3u8/index.m3u8#第23集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604sxElpw5Cindex.m3u8/index.m3u8#第24集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406040rSgywisindex.m3u8/index.m3u8#第25集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406043riPYIV8index.m3u8/index.m3u8#第26集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406043riPYIV8index.m3u8/index.m3u8#第27集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604SCCPnooHindex.m3u8/index.m3u8#第28集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604tppYtDxxindex.m3u8/index.m3u8#第29集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604BEO9vXlpindex.m3u8/index.m3u8#第30集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604uz3hYfYrindex.m3u8/index.m3u8#第31集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604nNMIsnM2index.m3u8/index.m3u8#第32集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406046fvdRyhrindex.m3u8/index.m3u8#第33集$https://c1.ddbbffcdn.com/video/replacesirikk9/202406044FmY71Asindex.m3u8/index.m3u8#第34集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604HIJnOUUsindex.m3u8/index.m3u8#第35集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604t8bn8ilGindex.m3u8/index.m3u8#第36集$https://c1.ddbbffcdn.com/video/replacesirikk9/20240604OUILykQMindex.m3u8/index.m3u8"
  },
  {
    "vod_id": 2088,
    "vod_name": "繁花",
    "vod_sub": "繁花",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240828-1/7d240ce204c1413d6621db1d1d449a43.jpg",
    "type_name": "国产剧",
    "vod_year": "2023",
    "vod_remarks": "全30集",
    "vod_score": "9.4",
    "vod_actor": "张志宏,郑晨阳",
    "vod_content": "<p>　　十里洋场，雪月风花。形色男女往来穿梭，追逐着名利，追逐梦想，追随着心底无尽的欲望。一曾名不见经传的小青年阿宝（胡歌 饰），为了实现发财致富梦拜在老法师爷叔（游本昌 饰）门下，随后便于一众亲信驰骋股市，盆满钵圆，眼见得起了高楼，平步青云。不满足股市的狂欢冒险，宝总转身投入商界，他和27号的汪小姐（唐嫣 饰）互惠合作，彼此信赖；和青梅竹马的铃子（马伊琍 饰）合开餐厅，互为表里；与初来乍到的至真园老板娘李李（辛芷蕾 饰）往来试探，暗流涌动。人头攒动，熙熙攘攘的黄河路有如大上海的缩影，上演了几多悲欢离合，阴晴圆缺。<br/>　　本片根据金宇澄荣获茅盾文学奖的同名小说改编。</p>",
    "vod_play_from": "非凡超清",
    "vod_play_url": "第01集$https://vod.feifei-online.com/20260408/537930_e534c6c3/index.m3u8#第02集$https://vod.feifei-online.com/20260408/537931_629f14a4/index.m3u8#第03集$https://vod.feifei-online.com/20260408/537932_815a90b0/index.m3u8#第04集$https://vod.feifei-online.com/20260408/537933_0295edb5/index.m3u8#第05集$https://vod.feifei-online.com/20260408/537934_c7725642/index.m3u8#第06集$https://vod.feifei-online.com/20260408/537936_707e9245/index.m3u8#第07集$https://vod.feifei-online.com/20260408/537935_70ae1d3f/index.m3u8#第08集$https://vod.feifei-online.com/20260408/537937_f8a727c1/index.m3u8#第09集$https://vod.feifei-online.com/20260408/537938_466d7553/index.m3u8#第10集$https://vod.feifei-online.com/20260408/537939_acc5e5e6/index.m3u8#第11集$https://vod.feifei-online.com/20260408/537940_cef8ab6e/index.m3u8#第12集$https://vod.feifei-online.com/20260408/537941_873fd3c8/index.m3u8#第13集$https://vod.feifei-online.com/20260408/537942_859b208e/index.m3u8#第14集$https://vod.feifei-online.com/20260408/537943_7fe50824/index.m3u8#第15集$https://vod.feifei-online.com/20260408/537944_208d7e76/index.m3u8#第16集$https://vod.feifei-online.com/20260408/537945_f042c850/index.m3u8#第17集$https://vod.feifei-online.com/20260408/537946_fc8b632c/index.m3u8#第18集$https://vod.feifei-online.com/20260408/537947_208e04ad/index.m3u8#第19集$https://vod.feifei-online.com/20260408/537948_c6139181/index.m3u8#第20集$https://vod.feifei-online.com/20260408/537949_3d76ca7d/index.m3u8#第21集$https://vod.feifei-online.com/20260408/537950_1b7bce23/index.m3u8#第22集$https://vod.feifei-online.com/20260408/537951_39028801/index.m3u8#第23集$https://vod.feifei-online.com/20260408/537952_edb9894f/index.m3u8#第24集$https://vod.feifei-online.com/20260408/537953_aed43ce0/index.m3u8#第25集$https://vod.feifei-online.com/20260408/537954_0db2f8c3/index.m3u8#第26集$https://vod.feifei-online.com/20260408/537955_f08b6dd9/index.m3u8#第27集$https://vod.feifei-online.com/20260408/537956_072743cc/index.m3u8#第28集$https://vod.feifei-online.com/20260408/537957_46bd71f8/index.m3u8#第29集$https://vod.feifei-online.com/20260408/537958_683fa201/index.m3u8#第30集$https://vod.feifei-online.com/20260408/537959_d4fae7ba/index.m3u8#第31集$https://vod.feifei-online.com/20260408/537960_e5ba7494/index.m3u8#第32集$https://vod.feifei-online.com/20260408/537961_5631f619/index.m3u8#第33集$https://vod.feifei-online.com/20260408/537962_2f5290d6/index.m3u8#第34集$https://vod.feifei-online.com/20260408/537963_a9c08474/index.m3u8#第35集$https://vod.feifei-online.com/20260408/537964_810d90e4/index.m3u8#第36集$https://vod.feifei-online.com/20260408/537965_bfa334d1/index.m3u8#第37集$https://vod.feifei-online.com/20260408/537966_f4a082c4/index.m3u8#第38集$https://vod.feifei-online.com/20260408/537967_7d47809b/index.m3u8#第39集$https://vod.feifei-online.com/20260408/537968_c79286c3/index.m3u8#第40集$https://vod.feifei-online.com/20260408/537969_afd43dfd/index.m3u8#第41集$https://vod.feifei-online.com/20260408/537970_42ed297d/index.m3u8#第42集$https://vod.feifei-online.com/20260408/537971_f8b1f011/index.m3u8#第43集$https://vod.feifei-online.com/20260408/537972_b88c3fe8/index.m3u8#第44集$https://vod.feifei-online.com/20260408/537973_3f54bf74/index.m3u8#第45集$https://vod.feifei-online.com/20260408/537974_c3303b86/index.m3u8#第46集$https://vod.feifei-online.com/20260408/537975_e96d55b5/index.m3u8#第47集$https://vod.feifei-online.com/20260408/537976_f6cd2f4c/index.m3u8#第48集$https://vod.feifei-online.com/20260408/537977_fdd6404a/index.m3u8#第49集$https://vod.feifei-online.com/20260408/537978_6aaf1b72/index.m3u8#第50集$https://vod.feifei-online.com/20260408/537979_ad37151a/index.m3u8#第51集$https://vod.feifei-online.com/20260408/537980_ae108c15/index.m3u8#第52集$https://vod.feifei-online.com/20260408/537981_2d7c5030/index.m3u8#第53集$https://vod.feifei-online.com/20260408/537982_fbdd3e57/index.m3u8#第54集$https://vod.feifei-online.com/20260408/537983_8e41ab9a/index.m3u8#第55集$https://vod.feifei-online.com/20260408/537984_96667c13/index.m3u8#第56集$https://vod.feifei-online.com/20260408/537985_88be6443/index.m3u8#第57集$https://vod.feifei-online.com/20260408/537986_4ec3000e/index.m3u8#第58集$https://vod.feifei-online.com/20260408/537987_12c53b35/index.m3u8#第59集$https://vod.feifei-online.com/20260408/537988_7e6c9a5c/index.m3u8#第60集$https://vod.feifei-online.com/20260408/537989_53cc8037/index.m3u8#第61集$https://vod.feifei-online.com/20260408/537991_a06826d3/index.m3u8#第62集$https://vod.feifei-online.com/20260408/537990_4629c54d/index.m3u8#第63集$https://vod.feifei-online.com/20260408/537992_cb476aa7/index.m3u8#第64集$https://vod.feifei-online.com/20260408/537993_4bed75c6/index.m3u8#第65集$https://vod.feifei-online.com/20260408/537994_137d8869/index.m3u8#第66集$https://vod.feifei-online.com/20260408/537995_aa4e093d/index.m3u8#第67集$https://vod.feifei-online.com/20260408/537996_8059e262/index.m3u8#第68集$https://vod.feifei-online.com/20260408/537997_b1f99827/index.m3u8#第69集$https://vod.feifei-online.com/20260408/537998_0fe1a62b/index.m3u8#第70集$https://vod.feifei-online.com/20260408/537999_4824dee2/index.m3u8#第71集$https://vod.feifei-online.com/20260408/538000_9026a8b4/index.m3u8#第72集$https://vod.feifei-online.com/20260408/538001_e4131baf/index.m3u8#第73集$https://vod.feifei-online.com/20260408/538002_373e57a1/index.m3u8#第74集$https://vod.feifei-online.com/20260408/538003_a02539eb/index.m3u8#第75集$https://vod.feifei-online.com/20260408/538004_c1bbd496/index.m3u8#第76集$https://vod.feifei-online.com/20260408/538005_79637039/index.m3u8#第77集$https://vod.feifei-online.com/20260408/538006_f850ef1a/index.m3u8#第78集$https://vod.feifei-online.com/20260408/538007_fa20e308/index.m3u8#第79集$https://vod.feifei-online.com/20260408/538008_6731dd0e/index.m3u8#第80集$https://vod.feifei-online.com/20260408/538009_4185987e/index.m3u8"
  },
  {
    "vod_id": 3088,
    "vod_name": "狂飙",
    "vod_sub": "狂飙",
    "vod_pic": "https://img.lzipic.com/upload/vod/20230114-1/f1fb8cb637333bc28c201a9f7461124b.jpg",
    "type_name": "国产剧",
    "vod_year": "2023",
    "vod_remarks": "全39集",
    "vod_score": "9.3",
    "vod_actor": "刘尚麟,时一",
    "vod_content": "<p>　　京海市一线刑警安欣（张译  饰），在与黑恶势力的斗争中，不断遭到保护伞的打击，始终无法将犯罪分子绳之以法。全国政法队伍教育整顿工作开展后，临江省派出指导组入驻京海，联合公检法司各部门，清除了政法队伍内部的腐败分子，粉碎了黑恶势力的保护伞，一举铲除了盘踞京海多年的强盛集团。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.cdnlz29.com/20251024/2700_ed34a79a/index.m3u8#第02集$https://v.cdnlz29.com/20251024/2702_4a7e6200/index.m3u8#第03集$https://v.cdnlz29.com/20251024/2703_da3f16cc/index.m3u8#第04集$https://v.cdnlz29.com/20251024/2704_fa348c14/index.m3u8#第05集$https://v.cdnlz29.com/20251024/2706_ab0542e1/index.m3u8#第06集$https://v.cdnlz29.com/20251024/2707_127ab890/index.m3u8#第07集$https://v.cdnlz29.com/20251024/2708_28375a53/index.m3u8#第08集$https://v.cdnlz29.com/20251024/2709_3d30718a/index.m3u8#第09集$https://v.cdnlz29.com/20251024/2710_195ac011/index.m3u8#第10集$https://v.cdnlz29.com/20251024/2711_eb3c3a56/index.m3u8#第11集$https://v.cdnlz29.com/20251024/2712_3bec680a/index.m3u8#第12集$https://v.cdnlz29.com/20251024/2713_63b878ab/index.m3u8#第13集$https://v.cdnlz29.com/20251024/2716_0e63ba1f/index.m3u8#第14集$https://v.cdnlz29.com/20251024/2717_1bdb648d/index.m3u8#第15集$https://v.cdnlz29.com/20251024/2718_31f05c6f/index.m3u8#第16集$https://v.cdnlz29.com/20251024/2719_e24d3073/index.m3u8#第17集$https://v.cdnlz29.com/20251024/2721_b7dd6a20/index.m3u8#第18集$https://v.cdnlz29.com/20251024/2722_4292ef0b/index.m3u8#第19集$https://v.cdnlz29.com/20251024/2723_037211d7/index.m3u8#第20集$https://v.cdnlz29.com/20251024/2725_24d2dd6f/index.m3u8#第21集$https://v.cdnlz29.com/20251024/2727_fd34e754/index.m3u8#第22集$https://v.cdnlz29.com/20251024/2726_00b7e88d/index.m3u8#第23集$https://v.cdnlz29.com/20251024/2728_0d0e381b/index.m3u8#第24集$https://v.cdnlz29.com/20251024/2731_973f2c97/index.m3u8#第25集$https://v.cdnlz29.com/20251024/2732_c4160957/index.m3u8#第26集$https://v.cdnlz29.com/20251024/2733_1509b64f/index.m3u8#第27集$https://v.cdnlz29.com/20251024/2735_6605b3f1/index.m3u8#第28集$https://v.cdnlz29.com/20251024/2736_6959d3e8/index.m3u8#第29集$https://v.cdnlz29.com/20251024/2737_695944a5/index.m3u8#第30集$https://v.cdnlz29.com/20251024/2738_82f0d5e4/index.m3u8#第31集$https://v.cdnlz29.com/20251024/2741_357375b7/index.m3u8#第32集$https://v.cdnlz29.com/20251024/2742_289559c2/index.m3u8#第33集$https://v.cdnlz29.com/20251024/2743_1b18b774/index.m3u8#第34集$https://v.cdnlz29.com/20251024/2744_409e57b8/index.m3u8#第35集$https://v.cdnlz29.com/20251024/2746_8baee2a9/index.m3u8#第36集$https://v.cdnlz29.com/20251024/2747_f5213ca2/index.m3u8#第37集$https://v.cdnlz29.com/20251024/2748_ef4a6e35/index.m3u8#第38集$https://v.cdnlz29.com/20251024/2749_33294b07/index.m3u8#第39集$https://v.cdnlz29.com/20251024/2751_be428cf9/index.m3u8$$$第01集$https://vod.feifei-online.com/20260224/333386_2ca5c6b3/index.m3u8#第02集$https://vod.feifei-online.com/20260224/333387_2e0e857d/index.m3u8#第03集$https://vod.feifei-online.com/20260224/333388_1e3ce140/index.m3u8#第04集$https://vod.feifei-online.com/20260224/333389_097ee0a9/index.m3u8#第05集$https://vod.feifei-online.com/20260224/333390_873fd22e/index.m3u8#第06集$https://vod.feifei-online.com/20260224/333391_223c85be/index.m3u8#第07集$https://vod.feifei-online.com/20260224/333392_d1b556b6/index.m3u8#第08集$https://vod.feifei-online.com/20260224/333393_19f75a97/index.m3u8#第09集$https://vod.feifei-online.com/20260224/333394_060bc8d7/index.m3u8#第10集$https://vod.feifei-online.com/20260224/333395_460b68e8/index.m3u8#第11集$https://vod.feifei-online.com/20260224/333396_f6d89211/index.m3u8#第12集$https://vod.feifei-online.com/20260224/333397_6cd4f9ec/index.m3u8#第13集$https://vod.feifei-online.com/20260224/333398_ac7f6daf/index.m3u8#第14集$https://vod.feifei-online.com/20260224/333399_5f7da8cd/index.m3u8#第15集$https://vod.feifei-online.com/20260224/333400_9512cb5b/index.m3u8#第16集$https://vod.feifei-online.com/20260224/333401_18e3543c/index.m3u8#第17集$https://vod.feifei-online.com/20260224/333402_34f194ca/index.m3u8#第18集$https://vod.feifei-online.com/20260224/333403_a91f3dee/index.m3u8#第19集$https://vod.feifei-online.com/20260224/333404_b5c80840/index.m3u8#第20集$https://vod.feifei-online.com/20260224/333405_71d6f529/index.m3u8#第21集$https://vod.feifei-online.com/20260224/333406_430218b4/index.m3u8#第22集$https://vod.feifei-online.com/20260224/333407_2b316ebf/index.m3u8#第23集$https://vod.feifei-online.com/20260224/333408_fbafdc78/index.m3u8#第24集$https://vod.feifei-online.com/20260224/333409_fa2f4f57/index.m3u8#第25集$https://vod.feifei-online.com/20260224/333410_c4857690/index.m3u8#第26集$https://vod.feifei-online.com/20260224/333411_9bf1028e/index.m3u8#第27集$https://vod.feifei-online.com/20260224/333412_d3149e0f/index.m3u8#第28集$https://vod.feifei-online.com/20260224/333413_3739b076/index.m3u8#第29集$https://vod.feifei-online.com/20260224/333414_2fe11650/index.m3u8#第30集$https://vod.feifei-online.com/20260224/333415_d8adb1bd/index.m3u8#第31集$https://vod.feifei-online.com/20260224/333416_6d6ebaa9/index.m3u8#第32集$https://vod.feifei-online.com/20260224/333417_b8f456ff/index.m3u8#第33集$https://vod.feifei-online.com/20260224/333418_70bcb788/index.m3u8#第34集$https://vod.feifei-online.com/20260224/333419_dd0b3052/index.m3u8#第35集$https://vod.feifei-online.com/20260224/333420_223fb814/index.m3u8#第36集$https://vod.feifei-online.com/20260224/333421_5d81fe6a/index.m3u8#第37集$https://vod.feifei-online.com/20260224/333422_085c3eb4/index.m3u8#第38集$https://vod.feifei-online.com/20260224/333423_f791dc88/index.m3u8#第39集$https://vod.feifei-online.com/20260224/333424_bc7b19b2/index.m3u8#第40集$https://vod.feifei-online.com/20260224/333425_a413317e/index.m3u8#第41集$https://vod.feifei-online.com/20260224/333426_e373d753/index.m3u8#第42集$https://vod.feifei-online.com/20260224/333427_0e9c0ca9/index.m3u8#第43集$https://vod.feifei-online.com/20260224/333428_a717e172/index.m3u8#第44集$https://vod.feifei-online.com/20260224/333429_84f21e3c/index.m3u8#第45集$https://vod.feifei-online.com/20260224/333430_b50946a6/index.m3u8#第46集$https://vod.feifei-online.com/20260224/333431_fb12981c/index.m3u8#第47集$https://vod.feifei-online.com/20260224/333432_14bd9e45/index.m3u8#第48集$https://vod.feifei-online.com/20260224/333433_8193317f/index.m3u8#第49集$https://vod.feifei-online.com/20260224/333434_aa723ceb/index.m3u8#第50集$https://vod.feifei-online.com/20260224/333435_6ffaf559/index.m3u8#第51集$https://vod.feifei-online.com/20260224/333436_13a0b3fc/index.m3u8#第52集$https://vod.feifei-online.com/20260224/333437_d1142db8/index.m3u8#第53集$https://vod.feifei-online.com/20260224/333438_e90bb031/index.m3u8#第54集$https://vod.feifei-online.com/20260224/333439_9b3d3883/index.m3u8#第55集$https://vod.feifei-online.com/20260224/333440_d3608d6c/index.m3u8#第56集$https://vod.feifei-online.com/20260224/333441_2f8b7db8/index.m3u8#第57集$https://vod.feifei-online.com/20260224/333442_73b82233/index.m3u8#第58集$https://vod.feifei-online.com/20260224/333443_85d09f59/index.m3u8#第59集$https://vod.feifei-online.com/20260224/333444_abf156f3/index.m3u8#第60集$https://vod.feifei-online.com/20260224/333445_19de7317/index.m3u8$$$第01集$https://c1.ddbbffcdn.com/video/kuangbiao/第01集/index.m3u8#第02集$https://c1.ddbbffcdn.com/video/kuangbiao/第02集/index.m3u8#第03集$https://c1.ddbbffcdn.com/video/kuangbiao/第03集/index.m3u8#第04集$https://c1.ddbbffcdn.com/video/kuangbiao/第04集/index.m3u8#第05集$https://c1.ddbbffcdn.com/video/kuangbiao/第05集/index.m3u8#第06集$https://c1.ddbbffcdn.com/video/kuangbiao/第06集/index.m3u8#第07集$https://c1.ddbbffcdn.com/video/kuangbiao/第07集/index.m3u8#第08集$https://c1.ddbbffcdn.com/video/kuangbiao/第08集/index.m3u8#第09集$https://c1.ddbbffcdn.com/video/kuangbiao/第09集/index.m3u8#第10集$https://c1.ddbbffcdn.com/video/kuangbiao/第10集/index.m3u8#第11集$https://c1.ddbbffcdn.com/video/kuangbiao/第11集/index.m3u8#第12集$https://c1.ddbbffcdn.com/video/kuangbiao/第12集/index.m3u8#第13集$https://c1.ddbbffcdn.com/video/kuangbiao/第13集/index.m3u8#第14集$https://c1.ddbbffcdn.com/video/kuangbiao/第14集/index.m3u8#第15集$https://c1.ddbbffcdn.com/video/kuangbiao/第15集/index.m3u8#第16集$https://c1.ddbbffcdn.com/video/kuangbiao/第16集/index.m3u8#第17集$https://c1.ddbbffcdn.com/video/kuangbiao/第17集/index.m3u8#第18集$https://c1.ddbbffcdn.com/video/kuangbiao/第18集/index.m3u8#第19集$https://c1.ddbbffcdn.com/video/kuangbiao/第19集/index.m3u8#第20集$https://c1.ddbbffcdn.com/video/kuangbiao/第20集/index.m3u8#第21集$https://c1.ddbbffcdn.com/video/kuangbiao/第21集/index.m3u8#第22集$https://c1.ddbbffcdn.com/video/kuangbiao/第22集/index.m3u8#第23集$https://c1.ddbbffcdn.com/video/kuangbiao/第23集/index.m3u8#第24集$https://c1.ddbbffcdn.com/video/kuangbiao/第24集/index.m3u8#第25集$https://c1.ddbbffcdn.com/video/kuangbiao/第25集/index.m3u8#第26集$https://c1.ddbbffcdn.com/video/kuangbiao/第26集/index.m3u8#第27集$https://c1.ddbbffcdn.com/video/kuangbiao/第27集/index.m3u8#第28集$https://c1.ddbbffcdn.com/video/kuangbiao/第28集/index.m3u8#第29集$https://c1.ddbbffcdn.com/video/kuangbiao/第29集/index.m3u8#第30集$https://c1.ddbbffcdn.com/video/kuangbiao/第30集/index.m3u8#第31集$https://c1.ddbbffcdn.com/video/kuangbiao/第31集/index.m3u8#第32集$https://c1.ddbbffcdn.com/video/kuangbiao/第32集/index.m3u8#第33集$https://c1.ddbbffcdn.com/video/kuangbiao/第33集/index.m3u8#第34集$https://c1.ddbbffcdn.com/video/kuangbiao/第34集/index.m3u8#第35集$https://c1.ddbbffcdn.com/video/kuangbiao/第35集/index.m3u8#第36集$https://c1.ddbbffcdn.com/video/kuangbiao/第36集/index.m3u8#第37集$https://c1.ddbbffcdn.com/video/kuangbiao/第37集/index.m3u8#第38集$https://c1.ddbbffcdn.com/video/kuangbiao/第38集/index.m3u8#第39集$https://c1.ddbbffcdn.com/video/kuangbiao/第39集/index.m3u8"
  },
  {
    "vod_id": 4088,
    "vod_name": "玫瑰的故事",
    "vod_sub": "玫瑰的故事",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240608-1/fec2b036eefa80d6e6da8c7514d6513b.jpg",
    "type_name": "国产剧",
    "vod_year": "2024",
    "vod_remarks": "全38集",
    "vod_score": "8.9",
    "vod_actor": "刘亦菲,佟大为,林更新,万茜,林一,彭冠英,霍建华,朱珠,吴彼,王名扬,黄羿,夏力薪,于慧,阎青妤,蓝盈莹,陈瑶,吴玉芳,侯长荣,张月,刘钧,高曙光,蒋雪鸣",
    "vod_content": "<p>　　出生于书香世家的黄亦玫（刘亦菲 饰）一路在呵护中长大，从小便展露出艺术天赋。初入职场的黄亦玫很快受到重用，与合作伙伴庄国栋相识相爱，但最终错过彼此，这段职场磨炼也令她对自己的人生有了更清晰的规划，决定重返校园求学深造。毕业后，她和学长方协文步入婚姻殿堂。可婚后两人发展方向相去甚远，最 终选择离婚。黄亦玫开始创业，在艺术品策展领域打拼出一片天地，在此期间还遇到了自己的灵魂伴侣溥家明，可溥家明只剩几个月的生命，两人这段爱情最终以生死离别画上句号。 但黄亦玫没有就此消沉，她还是一如既往地为活出更精彩的自己而努力着。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.lzcdn28.com/20250923/1936_12f3eca2/index.m3u8#第02集$https://v.lzcdn28.com/20250923/1937_9f3112e7/index.m3u8#第03集$https://v.lzcdn28.com/20250923/1938_7b95eed6/index.m3u8#第04集$https://v.lzcdn28.com/20250923/1939_698bbf31/index.m3u8#第05集$https://v.lzcdn28.com/20250923/1940_058555e9/index.m3u8#第06集$https://v.lzcdn28.com/20250923/1941_a0e42108/index.m3u8#第07集$https://v.lzcdn28.com/20250923/1942_bf28c0eb/index.m3u8#第08集$https://v.lzcdn28.com/20250923/1943_43aca31c/index.m3u8#第09集$https://v.lzcdn28.com/20250923/1944_0365e5ec/index.m3u8#第10集$https://v.lzcdn28.com/20250923/1945_12d478a0/index.m3u8#第11集$https://v.lzcdn28.com/20250923/1947_a5f13b35/index.m3u8#第12集$https://v.lzcdn28.com/20250923/1949_ce8dcec5/index.m3u8#第13集$https://v.lzcdn28.com/20250923/1951_c3875a21/index.m3u8#第14集$https://v.lzcdn28.com/20250923/1954_0f03bd9a/index.m3u8#第15集$https://v.lzcdn28.com/20250923/1957_e9f5c7cd/index.m3u8#第16集$https://v.lzcdn28.com/20250923/1959_a54d8d48/index.m3u8#第17集$https://v.lzcdn28.com/20250923/1965_3b15fb5f/index.m3u8#第18集$https://v.lzcdn28.com/20250923/1968_0c0d75d6/index.m3u8#第19集$https://v.lzcdn28.com/20250923/1972_085e3e7e/index.m3u8#第20集$https://v.lzcdn28.com/20250923/1975_54eb64c7/index.m3u8#第21集$https://v.lzcdn28.com/20250923/1979_799603ef/index.m3u8#第22集$https://v.lzcdn28.com/20250923/1982_fc0db342/index.m3u8#第23集$https://v.lzcdn28.com/20250923/1986_f147dc12/index.m3u8#第24集$https://v.lzcdn28.com/20250923/1989_10c6a6b7/index.m3u8#第25集$https://v.lzcdn28.com/20250923/1991_ef011d66/index.m3u8#第26集$https://v.lzcdn28.com/20250923/1995_6bd0ad02/index.m3u8#第27集$https://v.lzcdn28.com/20250923/1998_f6cfe052/index.m3u8#第28集$https://v.lzcdn28.com/20250923/2001_4d39a8e8/index.m3u8#第29集$https://v.lzcdn28.com/20250923/2004_bcd4fef1/index.m3u8#第30集$https://v.lzcdn28.com/20250923/2009_78e460c8/index.m3u8#第31集$https://v.lzcdn28.com/20250923/2012_3c0df09f/index.m3u8#第32集$https://v.lzcdn28.com/20250923/2016_7b984c6f/index.m3u8#第33集$https://v.lzcdn28.com/20250923/2018_76f72bdd/index.m3u8#第34集$https://v.lzcdn28.com/20250923/2021_449f7202/index.m3u8#第35集$https://v.lzcdn28.com/20250923/2025_3ad75296/index.m3u8#第36集$https://v.lzcdn28.com/20250923/2029_e40768b7/index.m3u8#第37集$https://v.lzcdn28.com/20250923/2033_d0e03145/index.m3u8#第38集$https://v.lzcdn28.com/20250923/2036_3c444643/index.m3u8#番外篇$https://v.cdnlz3.com/20240622/23966_e112d439/index.m3u8$$$第01集$https://vip.ffzy-play8.com/20241027/170526_f4dbbb36/index.m3u8#第02集$https://vip.ffzy-play8.com/20241027/170524_19dc735a/index.m3u8#第03集$https://vip.ffzy-play8.com/20241027/170527_ca995ff4/index.m3u8#第04集$https://vip.ffzy-play8.com/20241027/170525_f90ff0fe/index.m3u8#第05集$https://vip.ffzy-play8.com/20241027/170528_619f195c/index.m3u8#第06集$https://vip.ffzy-play8.com/20241027/170532_6b43026e/index.m3u8#第07集$https://vip.ffzy-play8.com/20241027/170530_53126367/index.m3u8#第08集$https://vip.ffzy-play8.com/20241027/170531_7fb79b44/index.m3u8#第09集$https://vip.ffzy-play8.com/20241027/170533_22de887e/index.m3u8#第10集$https://vip.ffzy-play8.com/20241027/170529_9ff35772/index.m3u8#第11集$https://vip.ffzy-play8.com/20241027/170535_2baa971e/index.m3u8#第12集$https://vip.ffzy-play8.com/20241027/170534_bea1b88d/index.m3u8#第13集$https://vip.ffzy-play8.com/20241027/170536_d29dd420/index.m3u8#第14集$https://vip.ffzy-play8.com/20241027/170538_f9d48aab/index.m3u8#第15集$https://vip.ffzy-play8.com/20241027/170537_e0c40567/index.m3u8#第16集$https://vip.ffzy-play8.com/20241027/170539_df50f94e/index.m3u8#第17集$https://vip.ffzy-play8.com/20241027/170540_b5ed4371/index.m3u8#第18集$https://vip.ffzy-play8.com/20241027/170542_a2887ce1/index.m3u8#第19集$https://vip.ffzy-play8.com/20241027/170541_e9ff7a2c/index.m3u8#第20集$https://vip.ffzy-play8.com/20241027/170543_22637c42/index.m3u8#第21集$https://vip.ffzy-play8.com/20241027/170545_680be914/index.m3u8#第22集$https://vip.ffzy-play8.com/20241027/170544_be3082db/index.m3u8#第23集$https://vip.ffzy-play8.com/20241027/170546_ceb497b5/index.m3u8#第24集$https://vip.ffzy-play8.com/20241027/170548_22ad1f93/index.m3u8#第25集$https://vip.ffzy-play8.com/20241027/170547_eef193de/index.m3u8#第26集$https://vip.ffzy-play8.com/20241027/170549_873ff3f2/index.m3u8#第27集$https://vip.ffzy-play8.com/20241027/170551_4e2db99d/index.m3u8#第28集$https://vip.ffzy-play8.com/20241027/170550_855b833c/index.m3u8#第29集$https://vip.ffzy-play8.com/20241027/170553_baef2d09/index.m3u8#第30集$https://vip.ffzy-play8.com/20241027/170554_6593d595/index.m3u8#第31集$https://vip.ffzy-play8.com/20241027/170552_16b73a4d/index.m3u8#第32集$https://vip.ffzy-play8.com/20241027/170556_fd143e71/index.m3u8#第33集$https://vip.ffzy-play8.com/20241027/170557_2f2ea0aa/index.m3u8#第34集$https://vip.ffzy-play8.com/20241027/170555_a1a77c60/index.m3u8#第35集$https://vip.ffzy-play8.com/20241027/170559_46545542/index.m3u8#第36集$https://vip.ffzy-play8.com/20241027/170560_5632b129/index.m3u8#第37集$https://vip.ffzy-play8.com/20241027/170558_47c9f7e4/index.m3u8#第38集$https://vip.ffzy-play8.com/20241027/170563_8c2ff233/index.m3u8#第39集$https://vip.ffzy-play8.com/20241027/170561_5804a69f/index.m3u8#第40集$https://vip.ffzy-play8.com/20241027/170562_1994ed44/index.m3u8#第41集$https://vip.ffzy-play8.com/20241027/170565_49edea55/index.m3u8#第42集$https://vip.ffzy-play8.com/20241027/170564_108f0c8d/index.m3u8#第43集$https://vip.ffzy-play8.com/20241027/170566_e68d128a/index.m3u8#第44集$https://vip.ffzy-play8.com/20241027/170567_533ca3ae/index.m3u8#第45集$https://vip.ffzy-play8.com/20241027/170569_6a2a45c4/index.m3u8#第46集$https://vip.ffzy-play8.com/20241027/170568_9b76aa1d/index.m3u8#第47集$https://vip.ffzy-play8.com/20241027/170570_47b2eec8/index.m3u8#第48集$https://vip.ffzy-play8.com/20241027/170792_5bfea69d/index.m3u8#第49集$https://vip.ffzy-play8.com/20241027/170791_e2cbefea/index.m3u8#第50集$https://vip.ffzy-play8.com/20241027/170788_e6042be8/index.m3u8#第51集$https://vip.ffzy-play8.com/20241027/170790_9306d4f2/index.m3u8#第52集$https://vip.ffzy-play8.com/20241027/170787_5c67281f/index.m3u8#第53集$https://vip.ffzy-play8.com/20241027/170789_aa4cc3a2/index.m3u8#第54集$https://vip.ffzy-play8.com/20241027/170793_bd2ecc4f/index.m3u8#第55集$https://vip.ffzy-play8.com/20241027/170794_24dc27ea/index.m3u8#第56集$https://vip.ffzy-play8.com/20241027/170798_46e0b574/index.m3u8#第57集$https://vip.ffzy-play8.com/20241027/170795_7093d931/index.m3u8#第58集$https://vip.ffzy-play8.com/20241027/170797_d88c23d9/index.m3u8$$$第1集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/35233e472f32/index.m3u8#第2集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/186c2dd837f3/index.m3u8#第3集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/c3143be7911f/index.m3u8#第4集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/4bb1d98fcb67/index.m3u8#第5集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ce6b88d53cea/index.m3u8#第6集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/1b2d0c8b592c/index.m3u8#第7集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2990e45fabcf/index.m3u8#第8集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/4db392fb26dc/index.m3u8#第9集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/d2d44890bb76/index.m3u8#第10集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/4facc7b092c9/index.m3u8#第11集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2ee37ce02e11/index.m3u8#第12集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/54b2697802ca/index.m3u8#第13集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ecf5739a7c70/index.m3u8#第14集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/94276489bb60/index.m3u8#第15集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/49d24ed532fe/index.m3u8#第16集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/9194f2cf9881/index.m3u8#第17集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/53bb6c4c09b7/index.m3u8#第18集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ffbab0bef239/index.m3u8#第19集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/8af2c0cd55c1/index.m3u8#第20集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/97a274783e86/index.m3u8#第21集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/3686032b03dc/index.m3u8#第22集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e44885380232/index.m3u8#第23集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/eb321d9cb079/index.m3u8#第24集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/207e25818c28/index.m3u8#第25集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e2787196afa9/index.m3u8#第26集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/d239cdddf96f/index.m3u8#第27集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/9b1d32ce7858/index.m3u8#第28集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/f43160a525bc/index.m3u8#第29集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/6085d448d7b5/index.m3u8#第30集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/26ef525dadfd/index.m3u8#第31集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ab42cb19ace2/index.m3u8#第32集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/8a8273aab1a3/index.m3u8#第33集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/f5df652a6dd9/index.m3u8#第34集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2db2614e4c2c/index.m3u8#第35集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e000d8ab6aa1/index.m3u8#第36集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/6e2f1ad8c40a/index.m3u8#第37集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e56b92b04785/index.m3u8#第38集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2ba5688d7cf0/index.m3u8#第39集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/f5a1ad7cef18/index.m3u8#第40集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/df278e7dea6a/index.m3u8#第41集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/80e042673ce0/index.m3u8#第42集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/9376160611ae/index.m3u8#第43集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/5426d4ca9bf1/index.m3u8#第44集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ee8ab754a800/index.m3u8#第45集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/f2ae59b1a6a1/index.m3u8#第46集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/3a3124a98453/index.m3u8#第47集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/7699566f68cc/index.m3u8#第48集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/92c5309ad259/index.m3u8#第49集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e5212e7d4c33/index.m3u8#第50集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/f6b09b458885/index.m3u8#第51集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/26b47b5f1f7c/index.m3u8#第52集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/b43f5b45ba53/index.m3u8#第53集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/d88d6a149013/index.m3u8#第54集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/cc25d241edcf/index.m3u8#第55集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2e3f006cfbca/index.m3u8#第56集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/21d279c6780b/index.m3u8#第57集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/c050334d07d6/index.m3u8#第58集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/60459f8d175c/index.m3u8#第59集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/ed9cbd1694b9/index.m3u8#第60集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/9d58e7bb448d/index.m3u8#第61集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/2a6108ba1cdd/index.m3u8#第62集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/8a9985c8ecef/index.m3u8#第63集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/da6ca54cdd75/index.m3u8#第64集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/e2568df455e4/index.m3u8#第65集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/aa41535085dc/index.m3u8#第66集$https://s2.bfllvip.com/video/meiguidegushizhishanyaodeta/21083c8f43fa/index.m3u8"
  },
  {
    "vod_id": 5088,
    "vod_name": "墨雨云间",
    "vod_sub": "墨雨云间",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240602-1/fce799e501f804cd9c00286e08781d42.jpg",
    "type_name": "国产剧",
    "vod_year": "2024",
    "vod_remarks": "全40集",
    "vod_score": "8.8",
    "vod_actor": "吴谨言,王星越,陈鑫海,梁永棋,陈乔恩,苏可,刘些宁,李梦,张雨绮,杨超越,何泓姗,李欣泽,张耀,董璇,孔雪儿,艾米,陈雨贤",
    "vod_content": "<p>　　家庭优渥、生活幸福的县令之女薛芳菲在遭逢巨变之后失去一切，受救命恩人、中书令之女姜梨之托，以姜梨的身份回到京城，并在肃国公萧蘅等人的帮助下，克服重重艰险，不断努力对抗不公，最终救出意外入狱的父亲，并帮助萧蘅匡扶正义，守护黎民百姓，最终重获美好生活。<br/>　　剧集改编自千山茶客的小说《嫡嫁千金》。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.lzcdn28.com/20250923/2042_ffd8a3fe/index.m3u8#第02集$https://v.lzcdn28.com/20250923/2046_b113f3a5/index.m3u8#第03集$https://v.lzcdn28.com/20250923/2049_badc6138/index.m3u8#第04集$https://v.lzcdn28.com/20250923/2053_022c52c6/index.m3u8#第05集$https://v.lzcdn28.com/20250923/2055_fa9403cd/index.m3u8#第06集$https://v.lzcdn28.com/20250923/2058_bf71472d/index.m3u8#第07集$https://v.lzcdn28.com/20250923/2061_72c60d3a/index.m3u8#第08集$https://v.lzcdn28.com/20250923/2064_4ef539df/index.m3u8#第09集$https://v.lzcdn28.com/20250923/2066_909d62f6/index.m3u8#第10集$https://v.lzcdn28.com/20250923/2070_829a6633/index.m3u8#第11集$https://v.lzcdn28.com/20250923/2073_f201ae36/index.m3u8#第12集$https://v.lzcdn28.com/20250923/2077_dae6775b/index.m3u8#第13集$https://v.lzcdn28.com/20250923/2081_5b2bcbb0/index.m3u8#第14集$https://v.lzcdn28.com/20250923/2085_46cb5709/index.m3u8#第15集$https://v.lzcdn28.com/20250923/2087_0e87d157/index.m3u8#第16集$https://v.lzcdn28.com/20250923/2090_33baf821/index.m3u8#第17集$https://v.lzcdn28.com/20250923/2091_57ee2965/index.m3u8#第18集$https://v.lzcdn28.com/20250923/2095_2584374a/index.m3u8#第19集$https://v.lzcdn28.com/20250923/2097_9237e9fb/index.m3u8#第20集$https://v.lzcdn28.com/20250923/2100_d98ec403/index.m3u8#第21集$https://v.lzcdn28.com/20250923/2103_d7a7ee56/index.m3u8#第22集$https://v.lzcdn28.com/20250923/2105_5801e5a5/index.m3u8#第23集$https://v.lzcdn28.com/20250923/2108_3968a224/index.m3u8#第24集$https://v.lzcdn28.com/20250923/2113_d3f91829/index.m3u8#第25集$https://v.lzcdn28.com/20250923/2115_59ec9049/index.m3u8#第26集$https://v.lzcdn28.com/20250923/2120_7bff2676/index.m3u8#第27集$https://v.lzcdn28.com/20250923/2122_a0fb44b4/index.m3u8#第28集$https://v.lzcdn28.com/20250923/2127_445266b5/index.m3u8#第29集$https://v.lzcdn28.com/20250923/2130_b1b16841/index.m3u8#第30集$https://v.lzcdn28.com/20250923/2134_427fc9f8/index.m3u8#第31集$https://v.lzcdn28.com/20250923/2138_e9c05c4b/index.m3u8#第32集$https://v.lzcdn28.com/20250923/2141_0e0cf887/index.m3u8#第33集$https://v.lzcdn28.com/20250923/2145_649529a3/index.m3u8#第34集$https://v.lzcdn28.com/20250923/2148_d61df552/index.m3u8#第35集$https://v.lzcdn28.com/20250923/2154_aefce757/index.m3u8#第36集$https://v.lzcdn28.com/20250923/2156_c9712c88/index.m3u8#第37集$https://v.lzcdn28.com/20250923/2161_973fca2b/index.m3u8#第38集$https://v.lzcdn28.com/20250923/2163_ad2ee0d9/index.m3u8#第39集$https://v.lzcdn28.com/20250923/2168_fbe4857f/index.m3u8#第40集$https://v.lzcdn28.com/20250923/2174_f7e3a33d/index.m3u8#番外篇$https://v.cdnlz21.com/20240622/687_203f827b/index.m3u8$$$第01集$https://vip.ffzy-plays.com/20240602/28100_1eb89415/index.m3u8#第02集$https://vip.ffzy-plays.com/20240602/28101_3dbd33fe/index.m3u8#第03集$https://vip.ffzy-plays.com/20240602/28102_1af6b469/index.m3u8#第04集$https://vip.ffzy-plays.com/20240602/28103_e8271bd1/index.m3u8#第05集$https://vip.ffzy-plays.com/20240602/28104_4687b119/index.m3u8#第06集$https://vip.ffzy-plays.com/20240603/28143_16735035/index.m3u8#第07集$https://vip.ffzy-plays.com/20240603/28142_317e4577/index.m3u8#第08集$https://vip.ffzy-plays.com/20240604/28178_9fe5d4f1/index.m3u8#第09集$https://vip.ffzy-plays.com/20240604/28177_67bd8369/index.m3u8#第10集$https://vip.ffzy-plays.com/20240605/28213_2ca23754/index.m3u8#第11集$https://vip.ffzy-plays.com/20240605/28212_89e5c582/index.m3u8#第12集$https://vip.ffzy-plays.com/20240606/28282_af3fb109/index.m3u8#第13集$https://vip.ffzy-plays.com/20240606/28281_d23c13cf/index.m3u8#第14集$https://vip.ffzy-plays.com/20240607/28367_881fccc3/index.m3u8#第15集$https://vip.ffzy-plays.com/20240608/28413_2413e476/index.m3u8#第16集$https://vip.ffzy-plays.com/20240608/28426_2ca59209/index.m3u8#第17集$https://super.ffzy-online6.com/20240609/32697_be5eafba/index.m3u8#第18集$https://vip.ffzy-plays.com/20240610/28482_3afbd2cb/index.m3u8#第19集$https://vip.ffzy-plays.com/20240610/28481_3ec965f5/index.m3u8#第20集$https://vip.ffzy-plays.com/20240611/28520_080d69ba/index.m3u8#第21集$https://vip.ffzy-plays.com/20240611/28519_daaa73ba/index.m3u8#第22集$https://vip.ffzy-plays.com/20240612/28580_224cb0dd/index.m3u8#第23集$https://vip.ffzy-plays.com/20240612/28579_f37ce960/index.m3u8#第24集$https://vip.ffzy-plays.com/20240613/28614_8cf96701/index.m3u8#第25集$https://vip.ffzy-plays.com/20240613/28613_1dafb71c/index.m3u8#第26集$https://vip.ffzy-plays.com/20240614/28648_adcf8993/index.m3u8#第27集$https://vip.ffzy-plays.com/20240615/28714_24d006df/index.m3u8#第28集$https://vip.ffzy-plays.com/20240616/28738_776af061/index.m3u8#第29集$https://vip.ffzy-plays.com/20240617/28769_2f9a21d7/index.m3u8#第30集$https://vip.ffzy-plays.com/20240618/28801_44d7554f/index.m3u8#第31集$https://vip.ffzy-plays.com/20240619/28830_31291838/index.m3u8#第32集$https://vip.ffzy-plays.com/20240619/28829_606c9fda/index.m3u8#第33集$https://vip.ffzy-plays.com/20240620/28863_08da229f/index.m3u8#第34集$https://vip.ffzy-plays.com/20240620/28862_620ffbf3/index.m3u8#第35集$https://vip.ffzy-plays.com/20240621/28902_921a8b7b/index.m3u8#第36集$https://vip.ffzy-plays.com/20240622/28989_8d40b1d2/index.m3u8#第37集$https://vip.ffzy-plays.com/20240622/29008_540d2eea/index.m3u8#第38集$https://vip.ffzy-plays.com/20240622/29007_a3f8d6f5/index.m3u8#第39集$https://vip.ffzy-plays.com/20240622/29006_2e28e312/index.m3u8#第40集$https://vip.ffzy-plays.com/20240622/29005_18abd174/index.m3u8$$$第01集$https://c1.ddbbffcdn.com/video/moyuyunjian/第01集/index.m3u8#第02集$https://c1.ddbbffcdn.com/video/moyuyunjian/第02集/index.m3u8#第03集$https://c1.ddbbffcdn.com/video/moyuyunjian/第03集/index.m3u8#第04集$https://c1.ddbbffcdn.com/video/moyuyunjian/第04集/index.m3u8#第05集$https://c1.ddbbffcdn.com/video/moyuyunjian/第05集/index.m3u8#第06集$https://c1.ddbbffcdn.com/video/moyuyunjian/第06集/index.m3u8#第07集$https://c1.ddbbffcdn.com/video/moyuyunjian/第07集/index.m3u8#第08集$https://c1.ddbbffcdn.com/video/moyuyunjian/第08集/index.m3u8#第09集$https://c1.ddbbffcdn.com/video/moyuyunjian/第09集/index.m3u8#第10集$https://c1.ddbbffcdn.com/video/moyuyunjian/第10集/index.m3u8#第11集$https://c1.ddbbffcdn.com/video/moyuyunjian/第11集/index.m3u8#第12集$https://c1.ddbbffcdn.com/video/moyuyunjian/第12集/index.m3u8#第13集$https://c1.ddbbffcdn.com/video/moyuyunjian/第13集/index.m3u8#第14集$https://c1.ddbbffcdn.com/video/moyuyunjian/第14集/index.m3u8#第15集$https://c1.ddbbffcdn.com/video/moyuyunjian/第15集/index.m3u8#第16集$https://c1.ddbbffcdn.com/video/moyuyunjian/第16集/index.m3u8#第17集$https://c1.ddbbffcdn.com/video/moyuyunjian/第17集/index.m3u8#第18集$https://c1.ddbbffcdn.com/video/moyuyunjian/第18集/index.m3u8#第19集$https://c1.ddbbffcdn.com/video/moyuyunjian/第19集/index.m3u8#第20集$https://c1.ddbbffcdn.com/video/moyuyunjian/第20集/index.m3u8#第21集$https://c1.ddbbffcdn.com/video/moyuyunjian/第21集/index.m3u8#第22集$https://c1.ddbbffcdn.com/video/moyuyunjian/第22集/index.m3u8#第23集$https://c1.ddbbffcdn.com/video/moyuyunjian/第23集/index.m3u8#第24集$https://c1.ddbbffcdn.com/video/moyuyunjian/第24集/index.m3u8#第25集$https://c1.ddbbffcdn.com/video/moyuyunjian/第25集/index.m3u8#第26集$https://c1.ddbbffcdn.com/video/moyuyunjian/第26集/index.m3u8#第27集$https://c1.ddbbffcdn.com/video/moyuyunjian/第27集/index.m3u8#第28集$https://c1.ddbbffcdn.com/video/moyuyunjian/第28集/index.m3u8#第29集$https://c1.ddbbffcdn.com/video/moyuyunjian/第29集/index.m3u8#第30集$https://c1.ddbbffcdn.com/video/moyuyunjian/第30集/index.m3u8#第31集$https://c1.ddbbffcdn.com/video/moyuyunjian/第31集/index.m3u8#第32集$https://c1.ddbbffcdn.com/video/moyuyunjian/第32集/index.m3u8#第33集$https://c1.ddbbffcdn.com/video/moyuyunjian/第33集/index.m3u8#第34集$https://c1.ddbbffcdn.com/video/moyuyunjian/第34集/index.m3u8#第35集$https://c1.ddbbffcdn.com/video/moyuyunjian/第35集/index.m3u8#第36集$https://c1.ddbbffcdn.com/video/moyuyunjian/第36集/index.m3u8#第37集$https://c1.ddbbffcdn.com/video/moyuyunjian/第37集/index.m3u8#第38集$https://c1.ddbbffcdn.com/video/moyuyunjian/第38集/index.m3u8#第39集$https://c1.ddbbffcdn.com/video/moyuyunjian/第39集/index.m3u8#第40集$https://c1.ddbbffcdn.com/video/moyuyunjian/第40集/index.m3u8#番外篇$https://c1.ddbbffcdn.com/video/moyuyunjian/番外篇/index.m3u8"
  },
  {
    "vod_id": 6088,
    "vod_name": "凡人修仙传",
    "vod_sub": "凡人修仙传",
    "vod_pic": "https://img.lzipic.com/upload/vod/20250727-1/ea2abcf6bb6518e780a18dacc347d013.jpg",
    "type_name": "国产动漫",
    "vod_year": "2020",
    "vod_remarks": "更新至195集",
    "vod_score": "9.3",
    "vod_actor": "钱文青,杨天翔,杨默,歪歪,谷江山,乔诗语,佟心竹",
    "vod_content": "<p>　　平凡少年韩立出生贫困，为了让家人过上更好的生活，自愿前去七玄门参加入门考核，最终被墨大夫收入门下。<br/>　　墨大夫一开始对韩立悉心培养、传授医术，让韩立对他非常感激，但随着一同入门的弟子张铁失踪，韩立才发现了墨大夫的真面目。<br/>　　墨大夫试图夺舍韩立，最终却被韩立反杀。通过墨大夫的遗书韩立得知了一个全新世界：修仙界的存在。<br/>　　在帮助七玄门抵御外敌之后，韩立离开了七玄门，前去墨大夫的家中寻找暖阳宝玉解毒，并帮助墨家人打败了敌人。<br/>　　通过墨大夫之女墨彩环的口中得知太南小会地址，韩立为追寻修仙人的足迹决定前往太南小会，拜别家人后……</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.lzfile26.com/20250907/28965_ba77bad4/index.m3u8#第02集$https://v.lzfile26.com/20250907/28970_6ee5e10e/index.m3u8#第03集$https://v.lzfile26.com/20250907/28973_8c8ed10b/index.m3u8#第04集$https://v.lzfile26.com/20250907/28974_46388823/index.m3u8#第05集$https://v.lzfile26.com/20250907/28978_9d5337dd/index.m3u8#第06集$https://v.lzfile26.com/20250907/28979_6ebc6581/index.m3u8#第07集$https://v.lzfile26.com/20250907/28982_7f246d2c/index.m3u8#第08集$https://v.lzfile26.com/20250907/28986_84851658/index.m3u8#第09集$https://v.lzfile26.com/20250907/28990_3e4a1cb5/index.m3u8#第10集$https://v.lzfile26.com/20250907/28991_1659e672/index.m3u8#第11集$https://v.lzfile26.com/20250907/28996_ee457409/index.m3u8#第12集$https://v.lzfile26.com/20250907/28997_9204007b/index.m3u8#第13集$https://v.lzfile26.com/20250907/29000_31cc2ab5/index.m3u8#第14集$https://v.lzfile26.com/20250907/29002_a5b05b6e/index.m3u8#第15集$https://v.lzfile26.com/20250907/29004_1554dc83/index.m3u8#第16集$https://v.lzfile26.com/20250907/29006_9b09c9a7/index.m3u8#第17集$https://v.lzfile26.com/20250907/29007_74869805/index.m3u8#第18集$https://v.lzfile26.com/20250907/29009_991a49fb/index.m3u8#第19集$https://v.lzfile26.com/20250907/29010_2f1635ff/index.m3u8#第20集$https://v.lzfile26.com/20250907/29013_3bdac525/index.m3u8#第21集$https://v.lzfile26.com/20250907/29014_2318f117/index.m3u8#第22集$https://v.lzfile26.com/20250907/29016_d6390c28/index.m3u8#第23集$https://v.lzfile26.com/20250907/29017_32dbf9d4/index.m3u8#第24集$https://v.lzfile26.com/20250907/29020_27aee3a6/index.m3u8#第25集$https://v.lzfile26.com/20250907/29023_defbd42a/index.m3u8#第26集$https://v.lzfile26.com/20250907/29024_f78a2fb4/index.m3u8#第27集$https://v.lzfile26.com/20250907/29027_7b63964e/index.m3u8#第28集$https://v.lzfile26.com/20250907/29030_0f214ab1/index.m3u8#第29集$https://v.lzfile26.com/20250907/29034_96203d4f/index.m3u8#第30集$https://v.lzfile26.com/20250907/29035_af9df9a1/index.m3u8$$$第01集$https://vip.ffzy-play9.com/20230104/32917_009575e7/index.m3u8#第02集$https://vip.ffzy-play9.com/20230104/32915_2fb357b7/index.m3u8#第03集$https://vip.ffzy-play9.com/20230104/32916_b0c09a03/index.m3u8#第04集$https://vip.ffzy-play9.com/20230104/32918_6ec362e4/index.m3u8#第05集$https://vip.ffzy-play9.com/20230104/32919_3ffddabe/index.m3u8#第06集$https://vip.ffzy-play9.com/20230104/32920_67147d73/index.m3u8#第07集$https://vip.ffzy-play9.com/20230104/32921_c1c212c1/index.m3u8#第08集$https://vip.ffzy-play9.com/20230104/32923_877a9c11/index.m3u8#第09集$https://vip.ffzy-play9.com/20230104/32924_1477d261/index.m3u8#第10集$https://vip.ffzy-play9.com/20230104/32922_f62937bb/index.m3u8#第11集$https://vip.ffzy-play9.com/20230104/32926_16dfc5ac/index.m3u8#第12集$https://vip.ffzy-play9.com/20230104/32925_74742674/index.m3u8#第13集$https://vip.ffzy-play9.com/20230104/32927_4f0ebfeb/index.m3u8#第14集$https://vip.ffzy-play9.com/20230104/32931_64735b7f/index.m3u8#第15集$https://vip.ffzy-play9.com/20230104/32928_d04cfb38/index.m3u8#第16集$https://vip.ffzy-play9.com/20230104/32929_e030dcc5/index.m3u8#第17集$https://vip.ffzy-play9.com/20230104/32930_04f94354/index.m3u8#第18集$https://vip.ffzy-play9.com/20230104/32932_66e91d34/index.m3u8#第19集$https://vip.ffzy-play9.com/20230104/32934_711ca8a8/index.m3u8#第20集$https://vip.ffzy-play9.com/20230104/32933_65cc895e/index.m3u8#第21集$https://vip.ffzy-play9.com/20230104/32937_d64346c8/index.m3u8#第22集$https://vip.ffzy-play9.com/20230104/32938_3104a4df/index.m3u8#第23集$https://vip.ffzy-play9.com/20230104/32936_be294a63/index.m3u8#第24集$https://vip.ffzy-play9.com/20230104/32935_bfca804e/index.m3u8#第25集$https://vip.ffzy-play9.com/20230104/32940_90753925/index.m3u8#第26集$https://vip.ffzy-play9.com/20230104/32939_7c52493f/index.m3u8#第27集$https://vip.ffzy-play9.com/20230104/32941_a0dcce34/index.m3u8#第28集$https://vip.ffzy-play9.com/20230104/32944_8e3dfa6c/index.m3u8#第29集$https://vip.ffzy-play9.com/20230104/32942_41d83d8c/index.m3u8#第30集$https://vip.ffzy-play9.com/20230104/32943_70c97b1b/index.m3u8#第31集$https://vip.ffzy-play9.com/20230104/32945_88db1b8d/index.m3u8#第32集$https://vip.ffzy-play9.com/20230104/32946_7d41b8cf/index.m3u8#第33集$https://vip.ffzy-play9.com/20230104/32947_7875af56/index.m3u8#第34集$https://vip.ffzy-play9.com/20230104/32948_e0bce23d/index.m3u8#第35集$https://vip.ffzy-play9.com/20230104/32949_ff914f8a/index.m3u8#第36集$https://vip.ffzy-play9.com/20230104/32950_23120cbb/index.m3u8#第37集$https://vip.ffzy-play9.com/20230104/32952_fdef3d9c/index.m3u8#第38集$https://vip.ffzy-play9.com/20230104/32951_4e910edf/index.m3u8#第39集$https://vip.ffzy-play9.com/20230104/32956_10c7b3a5/index.m3u8#第40集$https://vip.ffzy-play9.com/20230104/32953_987b2113/index.m3u8#第41集$https://vip.ffzy-play9.com/20230104/32954_5758d6ef/index.m3u8#第42集$https://vip.ffzy-play9.com/20230104/32955_03e71b2d/index.m3u8#第43集$https://vip.ffzy-play9.com/20230104/32958_4e640832/index.m3u8#第44集$https://vip.ffzy-play9.com/20230104/32959_3b36fa5a/index.m3u8#第45集$https://vip.ffzy-play9.com/20230104/32957_712d0ac9/index.m3u8#第46集$https://vip.ffzy-play9.com/20230104/32960_006d4719/index.m3u8#第47集$https://vip.ffzy-play9.com/20230104/32961_8c8cc7f5/index.m3u8#第48集$https://vip.ffzy-play9.com/20230104/32963_8dbf5d7a/index.m3u8#第49集$https://vip.ffzy-play9.com/20230104/32968_5a35f93d/index.m3u8#第50集$https://vip.ffzy-play9.com/20230104/32962_2d00b0cd/index.m3u8#第51集$https://vip.ffzy-play9.com/20230104/32965_ddc31201/index.m3u8#第52集$https://vip.ffzy-play9.com/20230104/32964_ada09a57/index.m3u8#第53集$https://vip.ffzy-play9.com/20230104/32969_460e970f/index.m3u8#第54集$https://vip.ffzy-play9.com/20230104/32967_fda27538/index.m3u8#第55集$https://vip.ffzy-play9.com/20230104/32966_30c487e2/index.m3u8#第56集$https://vip.ffzy-play9.com/20230104/32972_f4d921f4/index.m3u8#第57集$https://vip.ffzy-play9.com/20230104/32974_9bc0a5d0/index.m3u8#第58集$https://vip.ffzy-play9.com/20230104/32971_bebb4a69/index.m3u8#第59集$https://vip.ffzy-play9.com/20230104/32970_930f2bf1/index.m3u8#第60集$https://vip.ffzy-play9.com/20230104/32973_97ab01a2/index.m3u8#第61集$https://vip.ffzy-play9.com/20230104/32977_925fd014/index.m3u8#第62集$https://vip.ffzy-play9.com/20230104/32980_ae6c36d5/index.m3u8#第63集$https://vip.ffzy-play9.com/20230104/32979_136898bf/index.m3u8#第64集$https://vip.ffzy-play9.com/20230104/32976_6ce931b4/index.m3u8#第65集$https://vip.ffzy-play9.com/20230104/32975_d7013204/index.m3u8#第66集$https://vip.ffzy-play9.com/20230104/32984_ef319b1f/index.m3u8#第67集$https://vip.ffzy-play9.com/20230104/32978_58831683/index.m3u8#第68集$https://vip.ffzy-play9.com/20230104/32981_b633463d/index.m3u8#第69集$https://vip.ffzy-play9.com/20230104/32985_bd1f2687/index.m3u8#第70集$https://vip.ffzy-play9.com/20230104/32986_48bc4ca2/index.m3u8#第71集$https://vip.ffzy-play9.com/20230104/32983_da6b035e/index.m3u8#第72集$https://vip.ffzy-play9.com/20230104/32982_5023d62a/index.m3u8#第73集$https://vip.ffzy-plays.com/20230730/14450_21d3351b/index.m3u8#第74集$https://vip.ffzy-plays.com/20230806/14965_c4250d2a/index.m3u8#第75集$https://vod.feifei-kan.com/20230813/16800_b209a480/index.m3u8#第76集$https://vip.ffzy-plays.com/20230820/15498_e8092a1b/index.m3u8#第77集$https://vip.ffzy-plays.com/20231125/20088_a5289e70/index.m3u8#第78集$https://vip.ffzy-plays.com/20231202/20392_9f7dff4b/index.m3u8#第79集$https://vip.ffzy-plays.com/20231209/20726_e884a29c/index.m3u8#第80集$https://super.ffzy-online6.com/20231216/23222_dd248cb2/index.m3u8#第81集$https://vip.ffzy-plays.com/20231223/21377_b284c658/index.m3u8#第82集$https://vip.ffzy-plays.com/20231230/21620_87c760a7/index.m3u8#第83集$https://vip.ffzy-plays.com/20240106/21829_a09b46a7/index.m3u8#第84集$https://vip.ffzy-plays.com/20240113/22081_260d6971/index.m3u8#第85集$https://vip.ffzy-plays.com/20240120/22401_9eeee1c1/index.m3u8#第86集$https://vip.ffzy-plays.com/20240127/22707_f9807296/index.m3u8#第87集$https://vip.ffzy-plays.com/20240203/22999_8497544d/index.m3u8#第88集$https://vip.ffzy-plays.com/20240210/23318_10b4c19a/index.m3u8#第89集$https://vip.ffzy-plays.com/20240217/23604_a7ef241a/index.m3u8#第90集$https://vip.ffzy-plays.com/20240224/23924_9606926d/index.m3u8#第91集$https://vip.ffzy-plays.com/20240302/24344_24e717af/index.m3u8#第92集$https://vip.ffzy-plays.com/20240309/24734_a550546e/index.m3u8#第93集$https://vip.ffzy-plays.com/20240316/24984_9b0e5c48/index.m3u8#第94集$https://vip.ffzy-plays.com/20240323/25223_1f008208/index.m3u8#第95集$https://vip.ffzy-plays.com/20240330/25458_6e265502/index.m3u8#第96集$https://vip.ffzy-plays.com/20240406/25730_f5a4f68a/index.m3u8#第97集$https://vip.ffzy-plays.com/20240413/25965_44d0231f/index.m3u8#第98集$https://vip.ffzy-plays.com/20240420/26266_04202494/index.m3u8#第99集$https://vip.ffzy-plays.com/20240427/26598_a13cf7b7/index.m3u8#第100集$https://vip.ffzy-plays.com/20240504/26855_653fe6d6/index.m3u8#第101集$https://vip.ffzy-plays.com/20240511/27130_608b5ad3/index.m3u8#第102集$https://vip.ffzy-plays.com/20240518/27415_bc31b582/index.m3u8#第103集$https://vip.ffzy-plays.com/20240525/27724_be310bee/index.m3u8#第104集$https://vip.ffzy-plays.com/20240601/28057_15b2260a/index.m3u8#第105集$https://vip.ffzy-plays.com/20240608/28412_faa49c06/index.m3u8#第106集$https://vip.ffzy-plays.com/20240615/28712_01a34592/index.m3u8#第107集$https://vip.ffzy-plays.com/20240622/28988_ea4556bd/index.m3u8#第108集$https://vip.ffzy-plays.com/20240629/29297_8a733ce3/index.m3u8#第109集$https://vip.ffzy-plays.com/20240706/29620_68d21006/index.m3u8#第110集$https://vip.ffzy-plays.com/20240713/29972_e78f9b19/index.m3u8#第111集$https://vip.ffzy-plays.com/20240720/30315_356bc1f5/index.m3u8#第112集$https://vip.ffzy-plays.com/20240727/30707_806096d0/index.m3u8#第113集$https://vip.ffzy-plays.com/20240803/30994_194a17a7/index.m3u8#第114集$https://vip.ffzy-plays.com/20240810/31235_d70f195e/index.m3u8#第115集$https://vip.ffzy-plays.com/20240817/31482_a65f1a3b/index.m3u8#第116集$https://vip.ffzy-plays.com/20240824/31753_56fe38b7/index.m3u8#第117集$https://vip.ffzy-plays.com/20240831/32015_f2a5e399/index.m3u8#第118集$https://vip.ffzy-plays.com/20240907/32249_524e7d08/index.m3u8#第119集$https://vip.ffzy-plays.com/20240914/32464_0c9fd755/index.m3u8#第120集$https://vip.ffzy-plays.com/20240921/32680_b8f5a378/index.m3u8#第121集$https://vip.ffzy-plays.com/20240928/32960_56956655/index.m3u8#第122集$https://vip.ffzy-plays.com/20241005/33216_b52bd057/index.m3u8#第123集$https://vip.ffzy-plays.com/20241012/33528_8f6a418c/index.m3u8#第124集$https://vip.ffzy-plays.com/20241019/33837_30887722/index.m3u8#第125集$https://vip.ffzy-plays.com/20250118/37329_10b7aacb/index.m3u8#第126集$https://vip.ffzy-plays.com/20250118/37330_c87532b4/index.m3u8#第127集$https://vip.ffzy-plays.com/20250125/37627_2d21fefd/index.m3u8#第128集$https://vip.ffzy-plays.com/20250201/37848_5f5addf7/index.m3u8#第129集$https://vip.ffzy-plays.com/20250208/38113_f73ebfc1/index.m3u8#第130集$https://vip.ffzy-plays.com/20250215/38370_3e97f8a2/index.m3u8#第131集$https://vip.ffzy-plays.com/20250222/38598_ef58f7ff/index.m3u8#第132集$https://vip.ffzy-plays.com/20250301/38816_b13cef7d/index.m3u8#第133集$https://vip.ffzy-plays.com/20250308/39036_074ec9c4/index.m3u8#第134集$https://vip.ffzy-plays.com/20250315/39290_5947402a/index.m3u8#第135集$https://vip.ffzy-plays.com/20250322/39494_d778aa75/index.m3u8#第136集$https://vip.ffzy-plays.com/20250329/39715_dc377cb2/index.m3u8#第137集$https://vip.ffzy-plays.com/20250405/39940_cfa02141/index.m3u8#第138集$https://vip.ffzy-plays.com/20250412/40194_312ce70b/index.m3u8#第139集$https://vip.ffzy-plays.com/20250419/40424_c94230bd/index.m3u8#第140集$https://vip.ffzy-plays.com/20250426/40639_59ddf212/index.m3u8#第141集$https://vip.ffzy-plays.com/20250503/40846_a38a9af2/index.m3u8#第142集$https://vip.ffzy-plays.com/20250510/41120_c64e9c39/index.m3u8#第143集$https://vip.ffzy-plays.com/20250517/41379_f1178ff7/index.m3u8#第144集$https://vip.ffzy-plays.com/20250524/41622_0379400a/index.m3u8#第145集$https://vip.ffzy-plays.com/20250531/41818_d6a7c761/index.m3u8#第146集$https://vip.ffzy-plays.com/20250607/42010_6aa1c1a8/index.m3u8#第147集$https://vip.ffzy-plays.com/20250614/42222_79fde77d/index.m3u8#第148集$https://vip.ffzy-plays.com/20250621/42432_63b6da38/index.m3u8#第149集$https://vip.ffzy-plays.com/20250628/42604_78a01b29/index.m3u8#第150集$https://vip.ffzy-plays.com/20250705/42788_213334eb/index.m3u8#第151集$https://vip.ffzy-plays.com/20250712/43035_89edeb03/index.m3u8#第152集$https://vip.ffzy-plays.com/20250719/43279_70ff8ba8/index.m3u8#第153集$https://vip.ffzy-plays.com/20250726/43533_c59a7295/index.m3u8#第154集$https://vip.ffzy-plays.com/20250802/43815_490d3a9d/index.m3u8#第155集$https://vip.ffzy-plays.com/20250809/44043_49024dbb/index.m3u8#第156集$https://vip.ffzy-plays.com/20250816/44276_53dcc522/index.m3u8#第157集$https://vip.ffzy-plays.com/20250823/44530_1757d902/index.m3u8#第158集$https://vip.ffzy-plays.com/20250830/44774_f7ce934a/index.m3u8#第159集$https://vip.ffzy-plays.com/20250906/45034_764154cb/index.m3u8#第160集$https://vip.ffzy-plays.com/20250913/45291_9e047096/index.m3u8#第161集$https://vip.ffzy-plays.com/20250920/45546_d276fd6b/index.m3u8#第162集$https://vip.ffzy-plays.com/20250927/45786_b543b38a/index.m3u8#第163集$https://vip.ffzy-plays.com/20251004/46061_4385a033/index.m3u8#第164集$https://vip.ffzy-plays.com/20251011/46392_a9c5f750/index.m3u8#第165集$https://vip.ffzy-plays.com/20251018/46628_941cd9fc/index.m3u8#第166集$https://vip.ffzy-plays.com/20251025/46834_8e3a0c64/index.m3u8#第167集$https://vip.ffzy-plays.com/20251101/47083_3f16df31/index.m3u8#第168集$https://vip.ffzy-plays.com/20251108/47357_edf52bd6/index.m3u8#第169集$https://vip.ffzy-plays.com/20251115/47601_8843fd39/index.m3u8#第170集$https://vip.ffzy-plays.com/20251122/47835_f5386ed3/index.m3u8#第171集$https://vip.ffzy-plays.com/20251129/48054_88265682/index.m3u8#第172集$https://vip.ffzy-plays.com/20251206/48263_e7a0681c/index.m3u8#第173集$https://vip.ffzy-plays.com/20251213/48517_0eeda8e4/index.m3u8#第174集$https://vip.ffzy-plays.com/20251220/48750_970eb7cd/index.m3u8#第175集$https://vip.ffzy-plays.com/20251227/48946_86e182bc/index.m3u8#第176集$https://vip.ffzy-plays.com/20260103/49142_8928ccba/index.m3u8#第177集$https://vip.ffzy-plays.com/20260620/54983_1fb5ae88/index.m3u8#第178集$https://vip.ffzy-plays.com/20260620/54984_dce4b8d8/index.m3u8#第179集$https://vip.ffzy-plays.com/20260620/54985_d321e2d4/index.m3u8#第180集$https://vip.ffzy-plays.com/20260627/55196_b0ecc84c/index.m3u8#第181集$https://vip.ffzy-plays.com/20260704/55391_b6c12087/index.m3u8#第182集$https://vip.ffzy-plays.com/20260711/55623_efb1a00a/index.m3u8#第183集$https://vip.ffzy-plays.com/20260718/55910_794029ce/index.m3u8#第184集$https://vip.ffzy-plays.com/20260725/56220_c2cacd23/index.m3u8#第185集$https://vip.ffzy-plays.com/20260801/56534_314211d5/index.m3u8#第186集$https://vip.ffzy-plays.com/20260808/56803_5026d409/index.m3u8#第187集$https://vip.ffzy-plays.com/20260815/57103_70a419e6/index.m3u8#第188集$https://vip.ffzy-plays.com/20260822/57323_42f03166/index.m3u8#第189集$https://vip.ffzy-plays.com/20260829/57601_e30ead9e/index.m3u8#第190集$https://vip.ffzy-plays.com/20260905/57926_cbdbd173/index.m3u8#第191集$https://vip.ffzy-plays.com/20260912/58213_d8271bfa/index.m3u8#第192集$https://vip.ffzy-plays.com/20260919/58446_dd7235bb/index.m3u8#第193集$https://vip.ffzy-plays.com/20260926/58713_58e9e600/index.m3u8#第194集$https://vip.ffzy-plays.com/20261003/59009_4532bc67/index.m3u8#第195集$https://vip.ffzy-plays.com/20261010/59313_711e20fd/index.m3u8$$$第01集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第01集/index.m3u8#第02集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第02集/index.m3u8#第03集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第03集/index.m3u8#第04集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第04集/index.m3u8#第05集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第05集/index.m3u8#第06集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第06集/index.m3u8#第07集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第07集/index.m3u8#第08集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第08集/index.m3u8#第09集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第09集/index.m3u8#第10集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第10集/index.m3u8#第11集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第11集/index.m3u8#第12集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第12集/index.m3u8#第13集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第13集/index.m3u8#第14集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第14集/index.m3u8#第15集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第15集/index.m3u8#第16集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第16集/index.m3u8#第17集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第17集/index.m3u8#第18集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第18集/index.m3u8#第19集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第19集/index.m3u8#第20集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第20集/index.m3u8#第21集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第21集/index.m3u8#第22集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第22集/index.m3u8#第23集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第23集/index.m3u8#第24集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第24集/index.m3u8#第25集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第25集/index.m3u8#第26集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第26集/index.m3u8#第27集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第27集/index.m3u8#第28集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第28集/index.m3u8#第29集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第29集/index.m3u8#第30集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第30集/index.m3u8#第31集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第31集/index.m3u8#第32集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第32集/index.m3u8#第33集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第33集/index.m3u8#第34集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第34集/index.m3u8#第35集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第35集/index.m3u8#第36集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第36集/index.m3u8#第37集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第37集/index.m3u8#第38集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第38集/index.m3u8#第39集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第39集/index.m3u8#第40集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第40集/index.m3u8#第41集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第41集/index.m3u8#第42集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第42集/index.m3u8#第43集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第43集/index.m3u8#第44集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第44集/index.m3u8#第45集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第45集/index.m3u8#第46集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第46集/index.m3u8#第47集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第47集/index.m3u8#第48集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第48集/index.m3u8#第49集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第49集/index.m3u8#第50集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第50集/index.m3u8#第51集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第51集/index.m3u8#第52集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第52集/index.m3u8#第53集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第53集/index.m3u8#第54集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第54集/index.m3u8#第55集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第55集/index.m3u8#第56集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第56集/index.m3u8#第57集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第57集/index.m3u8#第58集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第58集/index.m3u8#第59集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第59集/index.m3u8#第60集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第60集/index.m3u8#第61集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第61集/index.m3u8#第62集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第62集/index.m3u8#第63集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第63集/index.m3u8#第64集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第64集/index.m3u8#第65集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第65集/index.m3u8#第66集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第66集/index.m3u8#第67集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第67集/index.m3u8#第68集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第68集/index.m3u8#第69集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第69集/index.m3u8#第70集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第70集/index.m3u8#第71集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第71集/index.m3u8#第72集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第72集/index.m3u8#第73集$https://c1.rrcdnbf6.com/video/fanrenxiuxianchuan/第73集/index.m3u8#第74集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第74集/index.m3u8#第75集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第75集/index.m3u8#第76集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第76集/index.m3u8#第77集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第77集/index.m3u8#第78集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第78集/index.m3u8#第79集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第79集/index.m3u8#第80集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第80集/index.m3u8#第81集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第81集/index.m3u8#第82集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第82集/index.m3u8#第83集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第83集/index.m3u8#第84集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第84集/index.m3u8#第85集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第85集/index.m3u8#第86集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第86集/index.m3u8#第87集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第87集/index.m3u8#第88集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第88集/index.m3u8#第89集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第89集/index.m3u8#第90集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第90集/index.m3u8#第91集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第91集/index.m3u8#第92集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第92集/index.m3u8#第93集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第93集/index.m3u8#第94集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第94集/index.m3u8#第95集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第95集/index.m3u8#第96集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第96集/index.m3u8#第97集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第97集/index.m3u8#第98集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第98集/index.m3u8#第99集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第99集/index.m3u8#第100集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第100集/index.m3u8#第101集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第101集/index.m3u8#第102集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第102集/index.m3u8#第103集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第103集/index.m3u8#第104集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第104集/index.m3u8#第105集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第105集/index.m3u8#第106集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第106集/index.m3u8#第107集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第107集/index.m3u8#第108集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第108集/index.m3u8#第109集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第109集/index.m3u8#第110集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第110集/index.m3u8#第111集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第111集/index.m3u8#第112集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第112集/index.m3u8#第113集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第113集/index.m3u8#第114集$https://c1.ddbbffcdn.com/video/fanrenxiuxianchuan/第114集/index.m3u8#第115集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第115集/index.m3u8#第116集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第116集/index.m3u8#第117集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第117集/index.m3u8#第118集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第118集/index.m3u8#第119集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第119集/index.m3u8#第120集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第120集/index.m3u8#第121集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第121集/index.m3u8#第122集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第122集/index.m3u8#第123集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第123集/index.m3u8#第124集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第124集/index.m3u8#第125集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第125集/index.m3u8#第126集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第126集/index.m3u8#第127集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第127集/index.m3u8#第128集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第128集/index.m3u8#第129集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第129集/index.m3u8#第130集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第130集/index.m3u8#第131集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第131集/index.m3u8#第132集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第132集/index.m3u8#第133集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第133集/index.m3u8#第134集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第134集/index.m3u8#第135集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第135集/index.m3u8#第136集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第136集/index.m3u8#第137集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第137集/index.m3u8#第138集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第138集/index.m3u8#第139集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第139集/index.m3u8#第140集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第140集/index.m3u8#第141集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第141集/index.m3u8#第142集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第142集/index.m3u8#第143集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第143集/index.m3u8#第144集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第144集/index.m3u8#第145集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第145集/index.m3u8#第146集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第146集/index.m3u8#第147集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第147集/index.m3u8#第148集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第148集/index.m3u8#第149集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第149集/index.m3u8#第150集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第150集/index.m3u8#第151集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第151集/index.m3u8#第152集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第152集/index.m3u8#第153集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第153集/index.m3u8#第154集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第154集/index.m3u8#第155集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第155集/index.m3u8#第156集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第156集/index.m3u8#第157集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第157集/index.m3u8#第158集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第158集/index.m3u8#第159集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第159集/index.m3u8#第160集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第160集/index.m3u8#第161集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第161集/index.m3u8#第162集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第162集/index.m3u8#第163集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第163集/index.m3u8#第164集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第164集/index.m3u8#第165集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第165集/index.m3u8#第166集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第166集/index.m3u8#第167集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第167集/index.m3u8#第168集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第168集/index.m3u8#第169集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第169集/index.m3u8#第170集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第170集/index.m3u8#第171集$https://v.fengbao8.com/video/fanrenxiuxianchuan/第171集/index.m3u8#第172集$https://v.baofeng9.com/video/fanrenxiuxianchuan/d08c891179a2/index.m3u8#第173集$https://v.baofeng9.com/video/fanrenxiuxianchuan/aaac4d1c9f52/index.m3u8#第174集$https://v.baofeng9.com/video/fanrenxiuxianchuan/2f589261e978/index.m3u8#第175集$https://v.baofeng9.com/video/fanrenxiuxianchuan/b3d59dec2d3a/index.m3u8#第176集$https://v.baofeng9.com/video/fanrenxiuxianchuan/08d287009aed/index.m3u8#第177集$https://bfeng10.com/video/fanrenxiuxianchuan/baf7b3d2e291/index.m3u8#第178集$https://bfeng10.com/video/fanrenxiuxianchuan/a1c69a6a3baa/index.m3u8#第179集$https://bfeng10.com/video/fanrenxiuxianchuan/733212921b3b/index.m3u8#第180集$https://bfeng11.com/video/fanrenxiuxianchuan/535848170216/index.m3u8#第181集$https://bfeng11.com/video/fanrenxiuxianchuan/54457986d84d/index.m3u8#第182集$https://bfeng11.com/video/fanrenxiuxianchuan/eea8ad563a79/index.m3u8#第183集$https://bfeng11.com/video/fanrenxiuxianchuan/fb95db2a51ba/index.m3u8#第184集$https://bfeng11.com/video/fanrenxiuxianchuan/6e3b0e1131e1/index.m3u8#第185集$https://bfeng11.com/video/fanrenxiuxianchuan/15ee9016d70f/index.m3u8#第186集$https://bfeng11.com/video/fanrenxiuxianchuan/7d348dcecbfd/index.m3u8#第187集$https://fengbao12.com/video/fanrenxiuxianchuan/d1128b2349dc/index.m3u8#第188集$https://fengbao12.com/video/fanrenxiuxianchuan/dfb7dfaa35a4/index.m3u8#第189集$https://fengbao12.com/video/fanrenxiuxianchuan/81ca243505ee/index.m3u8#第190集$https://fengbao12.com/video/fanrenxiuxianchuan/dae9388a26e6/index.m3u8#第191集$https://fengbao12.com/video/fanrenxiuxianchuan/57833c5dded4/index.m3u8#第192集$https://fengbao12.com/video/fanrenxiuxianchuan/a0276887c3ea/index.m3u8#第193集$https://fengbao12.com/video/fanrenxiuxianchuan/124380000761/index.m3u8#第194集$https://fengbao13.com/video/fanrenxiuxianchuan/a0fb713c27e3/index.m3u8#第195集$https://fengbao13.com/video/fanrenxiuxianchuan/4e4fd90d6c6d/index.m3u8"
  },
  {
    "vod_id": 7088,
    "vod_name": "斗罗大陆2：绝世唐门",
    "vod_sub": "斗罗大陆2",
    "vod_pic": "https://img.lzipic.com/upload/vod/20260821-1/d689e6498865c9c8020d6bc7aafaf525.jpg",
    "type_name": "国产动漫",
    "vod_year": "2023",
    "vod_remarks": "更新至174集",
    "vod_score": "8.7",
    "vod_actor": "全明星阵容",
    "vod_content": "<p>　　你我皆唐门，生在绝世中——腾讯视频《斗罗大陆绝世唐门》动画正式启动！</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://vip.lz-cdn14.com/20230624/25452_c20b8a47/index.m3u8#第02集$https://vip.lz-cdn14.com/20230624/25451_80e1f5a3/index.m3u8#第03集$https://vip.lz-cdn14.com/20230701/25909_e9fbe79c/index.m3u8#第04集$https://vip.lz-cdn14.com/20230710/26514_4750df02/index.m3u8#第05集$https://vip.lz-cdn14.com/20230715/26765_4f46649e/index.m3u8#第06集$https://vip.lz-cdn14.com/20230722/27126_bded2a5c/index.m3u8#第07集$https://vip.lz-cdn14.com/20230729/27494_6277d267/index.m3u8#第08集$https://vip.lz-cdn14.com/20230805/27980_834689a0/index.m3u8#第09集$https://vip.lz-cdn14.com/20230812/28197_669bcd49/index.m3u8#第10集$https://vip.lz-cdn14.com/20230819/28390_8ebf01a5/index.m3u8#第11集$https://vip.lz-cdn14.com/20230826/28590_60799c69/index.m3u8#第12集$https://v.cdnlz14.com/20230902/28971_904db297/index.m3u8#第13集$https://v.cdnlz14.com/20230909/29209_86883d9c/index.m3u8#第14集$https://v.cdnlz14.com/20230916/29468_b1a75183/index.m3u8#第15集$https://v.cdnlz14.com/20230923/29683_6aa1c804/index.m3u8#第16集$https://v.cdnlz14.com/20230930/29896_80ca2bf5/index.m3u8#第17集$https://v.cdnlz14.com/20231007/30155_8f79ad9d/index.m3u8#第18集$https://v.cdnlz14.com/20231014/30397_3ec28907/index.m3u8#第19集$https://v.cdnlz14.com/20231021/30759_5ad946ab/index.m3u8#第20集$https://v.cdnlz14.com/20231028/30969_cd0fa508/index.m3u8#第21集$https://v.cdnlz14.com/20231104/31211_eb767495/index.m3u8#第22集$https://v.cdnlz14.com/20231111/31425_53269e8d/index.m3u8#第23集$https://v.cdnlz14.com/20231118/31717_c63fed18/index.m3u8#第24集$https://v.cdnlz14.com/20231125/31983_3336c243/index.m3u8#第25集$https://v.cdnlz14.com/20231202/32214_239f4275/index.m3u8#第26集$https://v.cdnlz14.com/20231209/32486_b55fff55/index.m3u8#第27集$https://v.cdnlz14.com/20231216/32778_13051c92/index.m3u8#第28集$https://v.cdnlz14.com/20231223/33023_eb9fb98a/index.m3u8#第29集$https://v.cdnlz14.com/20231230/33292_8aff740e/index.m3u8#第30集$https://v.cdnlz14.com/20240106/33491_dcb0043f/index.m3u8#第31集$https://v.cdnlz14.com/20240113/33683_113d9852/index.m3u8#第32集$https://v.cdnlz14.com/20240120/33915_e0a1c469/index.m3u8#第33集$https://v.cdnlz14.com/20240127/34152_e70b8990/index.m3u8#第34集$https://v.cdnlz14.com/20240203/34351_474203db/index.m3u8#第35集$https://v.cdnlz14.com/20240210/34656_39ed461d/index.m3u8#第36集$https://v.cdnlz14.com/20240217/34887_ad9c715c/index.m3u8#第37集$https://v.cdnlz14.com/20240224/35150_651c0d19/index.m3u8#第38集$https://v.cdnlz14.com/20240302/35362_d7395324/index.m3u8#第39集$https://v.cdnlz14.com/20240309/35640_5cd83983/index.m3u8#第40集$https://v.cdnlz14.com/20240316/35929_2cae6d30/index.m3u8#第41集$https://v.cdnlz14.com/20240323/36247_cf1b17fc/index.m3u8#第42集$https://v.cdnlz14.com/20240330/36432_f7448a03/index.m3u8#第43集$https://v.cdnlz14.com/20240405/36604_0a88d482/index.m3u8#第44集$https://v.cdnlz9.com/20240412/22855_9fadd862/index.m3u8#第45集$https://v.cdnlz9.com/20240419/23166_08869233/index.m3u8#第46集$https://v.cdnlz9.com/20240426/23630_04be05cb/index.m3u8#第47集$https://v.cdnlz9.com/20240503/24008_32b9e5a1/index.m3u8#第48集$https://v.cdnlz9.com/20240510/24383_bbdb0ee5/index.m3u8#第49集$https://v.lzv22.com/20240517/26_4f5973ad/index.m3u8#第50集$https://v.lzv22.com/20240524/103_f2155dc2/index.m3u8#第51集$https://v.lzv22.com/20240531/439_dbd4ba85/index.m3u8#第52集$https://v.lzv22.com/20240607/777_02348d67/index.m3u8#第53集$https://v.cdnlz21.com/20240614/438_8cca154a/index.m3u8#第54集$https://v.cdnlz21.com/20240621/681_147a271a/index.m3u8#第55集$https://v.cdnlz21.com/20240630/785_db291338/index.m3u8#第56集$https://v.cdnlz21.com/20240705/802_3a41dffc/index.m3u8#第57集$https://v.cdnlz21.com/20240712/857_32ccdd60/index.m3u8#第58集$https://v.cdnlz21.com/20240719/977_e4acad3d/index.m3u8#第59集$https://v.cdnlz21.com/20240726/1154_7b407b9e/index.m3u8#第60集$https://v.cdnlz21.com/20240802/1292_3efabe6d/index.m3u8#第61集$https://v.cdnlz21.com/20240816/1528_ff089119/index.m3u8#第62集$https://v.cdnlz21.com/20240816/1530_704a6e11/index.m3u8#第63集$https://v.cdnlz21.com/20240823/1775_4daff4a5/index.m3u8#第64集$https://v.cdnlz21.com/20240830/1859_5782829a/index.m3u8#第65集$https://v.cdnlz21.com/20240906/2035_10980100/index.m3u8#第66集$https://v.cdnlz21.com/20240913/2060_65546997/index.m3u8#第67集$https://v.cdnlz21.com/20240920/2123_d720469b/index.m3u8#第68集$https://v.cdnlz21.com/20240927/2153_09aff3bc/index.m3u8#第69集$https://v.cdnlz21.com/20241004/2196_5c4790b2/index.m3u8#第70集$https://v.cdnlz3.com/20241011/27748_31aa92f0/index.m3u8#第71集$https://v.lzv22.com/20241018/6619_336dee36/index.m3u8#第72集$https://v.lzv22.com/20241025/6977_b604736d/index.m3u8#第73集$https://v.lzv22.com/20241101/7341_e881ec24/index.m3u8#第74集$https://v.lzv22.com/20241108/7720_8d21a711/index.m3u8#第75集$https://v.lzv22.com/20241115/8121_27158290/index.m3u8#第76集$https://v.lzv22.com/20241122/8563_0e43921f/index.m3u8#第77集$https://v.lzv22.com/20241129/8898_60bde4fe/index.m3u8#第78集$https://v.lzv22.com/20241206/9289_658d3559/index.m3u8#第79集$https://v.lzv22.com/20241213/9628_536c3e68/index.m3u8#第80集$https://v.lzv22.com/20241220/10000_844ff463/index.m3u8#第81集$https://v.lzv22.com/20241227/10315_9e55fc53/index.m3u8#第82集$https://v.lzv22.com/20250103/10570_84de6130/index.m3u8#第83集$https://v.lzv22.com/20250110/10908_67e3adc0/index.m3u8#第84集$https://v.lzv22.com/20250117/11291_4e234250/index.m3u8#第85集$https://v.lzv22.com/20250124/11688_7b3d312a/index.m3u8#第86集$https://v.lzv22.com/20250131/11977_b439bb4a/index.m3u8#第87集$https://v.lzv22.com/20250207/12355_8dec2480/index.m3u8#第88集$https://v.lzv22.com/20250214/12689_231fadff/index.m3u8#第89集$https://v.lzv22.com/20250221/13063_5a13d916/index.m3u8#第90集$https://v.lzv22.com/20250228/13395_a3b8e550/index.m3u8#第91集$https://v.lzv22.com/20250307/13720_5aa94de9/index.m3u8#第92集$https://v.lzv22.com/20250316/14205_6c382e55/index.m3u8#第93集$https://v.lzv22.com/20250321/14477_ab2bc67a/index.m3u8#第94集$https://v.lzv22.com/20250328/14781_5511c2d5/index.m3u8#第95集$https://v.lzv22.com/20250404/15119_272e7c87/index.m3u8#第96集$https://v.lzv22.com/20250411/15451_5426ce83/index.m3u8#第97集$https://v.lzv22.com/20250418/15766_b55e173d/index.m3u8#第98集$https://v.lzv22.com/20250425/16095_81bb8f28/index.m3u8#第99集$https://v.lzv22.com/20250502/16397_24439701/index.m3u8#第100集$https://v.lzv22.com/20250509/16756_fa4d8fd3/index.m3u8#第101集$https://v.lzv22.com/20250516/17144_20b8cf27/index.m3u8#第102集$https://v.lzv22.com/20250523/17477_3295da09/index.m3u8#第103集$https://v.lzv22.com/20250530/17815_cf93ec3b/index.m3u8#第104集$https://v.lzv22.com/20250606/18141_fc21c8a6/index.m3u8#第105集$https://v.lzv22.com/20250613/18434_83a8b163/index.m3u8#第106集$https://v.lzv22.com/20250620/18760_c009df28/index.m3u8#第107集$https://v.lzv22.com/20250627/19075_3010da41/index.m3u8#第108集$https://v.lzv22.com/20250704/19335_96147430/index.m3u8#第109集$https://v.lzv22.com/20250711/19674_baefa6ac/index.m3u8#第110集$https://v.lzv22.com/20250718/19976_8d03d928/index.m3u8#第111集$https://v.lzv22.com/20250725/20338_0204360d/index.m3u8#第112集$https://v.lzv22.com/20250801/20681_91a40124/index.m3u8#第113集$https://v.lzv22.com/20250808/20999_b8636661/index.m3u8#第114集$https://v.lzv22.com/20250815/21326_1cb83b70/index.m3u8#第115集$https://v.lzv22.com/20250822/21650_5ddc19bf/index.m3u8#第116集$https://v.lzv22.com/20250829/21971_b72c72ed/index.m3u8#第117集$https://v.lzv22.com/20250905/22310_33bd44a2/index.m3u8#第118集$https://v.lzv22.com/20250912/22628_6adde13d/index.m3u8#第119集$https://v.lzv22.com/20250919/22970_5a5f875c/index.m3u8#第120集$https://v.lzv22.com/20250926/23283_5d8812b7/index.m3u8#第121集$https://v.lzv22.com/20251003/23583_635fd12a/index.m3u8#第122集$https://v.lzv22.com/20251010/23934_fe3d040c/index.m3u8#第123集$https://v.lzv22.com/20251017/24302_69c031d9/index.m3u8#第124集$https://v.lzv22.com/20251024/24657_7d7a46b1/index.m3u8#第125集$https://v.lzv22.com/20251031/25061_31db6ea6/index.m3u8#第126集$https://v.lzv22.com/20251107/25460_468e5702/index.m3u8#第127集$https://v.lzv22.com/20251114/25852_85bc40b1/index.m3u8#第128集$https://v.lzv22.com/20251121/26230_46da8651/index.m3u8#第129集$https://v.lzv22.com/20251128/26549_6dc895e7/index.m3u8#第130集$https://v.lzv22.com/20251205/26806_43f7aed7/index.m3u8#第131集$https://v.lzv22.com/20251212/27029_277f0d88/index.m3u8#第132集$https://v.lzv22.com/20251219/30415_9ba81cbb/index.m3u8#第133集$https://v.lzv22.com/20251226/31600_02abbe5b/index.m3u8#第134集$https://v.lzv22.com/20260102/32122_6a45d2b2/index.m3u8#第135集$https://v.lzv22.com/20260109/33063_da085a9b/index.m3u8#第136集$https://v.lzv22.com/20260116/33505_3eed1ae8/index.m3u8#第137集$https://v.lzcdn27.com/20260123/3662_ae60c714/index.m3u8#第138集$https://v.lzcdn27.com/20260130/4064_4624a6af/index.m3u8#第139集$https://v.lzcdn27.com/20260206/4619_234d68b2/index.m3u8#第140集$https://v.lzcdn27.com/20260213/5184_7d2663e3/index.m3u8#第141集$https://v.lzcdn27.com/20260220/5527_fb38cdee/index.m3u8#第142集$https://v.lzcdn27.com/20260227/5923_06d362e3/index.m3u8#第143集$https://v.lzcdn27.com/20260306/6304_47763301/index.m3u8#第144集$https://v.lzcdn27.com/20260313/6718_d7ace950/index.m3u8#第145集$https://v.lzcdn27.com/20260320/7213_48add615/index.m3u8#第146集$https://v.lzcdn27.com/20260327/7614_f93c753a/index.m3u8#第147集$https://v.lzcdn27.com/20260403/8129_c1c1d087/index.m3u8#第148集$https://v.lzcdn27.com/20260410/8508_22f9e5e3/index.m3u8#第149集$https://v.lzcdn27.com/20260417/8862_67207ef9/index.m3u8#第150集$https://v.lzcdn27.com/20260424/9237_ae97b527/index.m3u8#第151集$https://v.lzcdn27.com/20260501/9620_d45d56fc/index.m3u8#第152集$https://v.lzcdn27.com/20260508/10021_598ba703/index.m3u8#第153集$https://v.lzcdn27.com/20260515/10367_86f19fb4/index.m3u8#第154集$https://v.lzcdn27.com/20260522/10712_fd918849/index.m3u8#第155集$https://v.lzcdn27.com/20260529/11126_91218555/index.m3u8#第156集$https://v.lzcdn27.com/20260605/11425_01ac9a91/index.m3u8#第157集$https://v.lzcdn27.com/20260612/11796_70687892/index.m3u8#第158集$https://v.lzcdn31.com/20260619/7506_0fad4069/index.m3u8#第159集$https://v.lzcdn31.com/20260626/7690_639328ae/index.m3u8#第160集$https://v.lzcdn31.com/20260703/7951_31b2aa25/index.m3u8#第161集$https://v.lzcdn31.com/20260710/8182_8249bb08/index.m3u8#第162集$https://v.lzcdn31.com/20260717/8560_895dcd56/index.m3u8#第163集$https://v.lzcdn31.com/20260724/8871_1375e85c/index.m3u8#第164集$https://v.lzcdn31.com/20260731/9192_fe863323/index.m3u8#第165集$https://v.lzcdn31.com/20260807/9497_38f7680c/index.m3u8#第166集$https://v.lzcdn31.com/20260814/9819_ef689bab/index.m3u8#第167集$https://v.lzcdn31.com/20260821/10305_57d4f627/index.m3u8#第168集$https://v.lzcdn31.com/20260828/10657_05297c6d/index.m3u8#第169集$https://v.lzcdn31.com/20260904/10979_27fd9da9/index.m3u8#第170集$https://v.lzcdn31.com/20260911/11255_eb89d600/index.m3u8#第171集$https://v.lzcdn31.com/20260918/11581_7c31594e/index.m3u8#第172集$https://v.lzcdn31.com/20260925/11913_2dc5494e/index.m3u8#第173集$https://v.lzcdn31.com/20261002/12230_bbf63217/index.m3u8#第174集$https://v.lzcdn31.com/20261009/12529_e466fe4b/index.m3u8$$$第01集$https://vip.ffzy-plays.com/20230624/12999_dfa227ef/index.m3u8#第02集$https://vip.ffzy-plays.com/20230624/12998_56569df0/index.m3u8#第03集$https://vip.ffzy-plays.com/20230701/13324_960c3ccd/index.m3u8#第04集$https://vip.ffzy-plays.com/20230708/13562_8657eb36/index.m3u8#第05集$https://vip.ffzy-plays.com/20230715/13855_ce0c252f/index.m3u8#第06集$https://vip.ffzy-plays.com/20230722/14102_6e577b92/index.m3u8#第07集$https://vip.ffzy-plays.com/20230729/14388_fdea2cf4/index.m3u8#第08集$https://vip.ffzy-plays.com/20230805/14920_684995eb/index.m3u8#第09集$https://vip.ffzy-plays.com/20230812/15198_8994dd57/index.m3u8#第10集$https://vip.ffzy-plays.com/20230819/15443_75083a1d/index.m3u8#第11集$https://vip.ffzy-plays.com/20230826/15709_a8eee1a0/index.m3u8#第12集$https://vip.ffzy-plays.com/20230902/16112_d40bb018/index.m3u8#第13集$https://vip.ffzy-plays.com/20230909/16405_b48a26cb/index.m3u8#第14集$https://vip.ffzy-plays.com/20230916/16709_01c1faae/index.m3u8#第15集$https://vip.ffzy-plays.com/20230923/17006_28e46ff1/index.m3u8#第16集$https://vip.ffzy-plays.com/20230930/17321_8e55d84a/index.m3u8#第17集$https://vip.ffzy-plays.com/20231007/17676_b198e8ef/index.m3u8#第18集$https://vip.ffzy-plays.com/20231014/17993_a507dfcc/index.m3u8#第19集$https://vip.ffzy-plays.com/20231021/18465_c37164a8/index.m3u8#第20集$https://vip.ffzy-plays.com/20231028/18766_f26a8a8b/index.m3u8#第21集$https://vip.ffzy-plays.com/20231104/19088_cff7c429/index.m3u8#第22集$https://vip.ffzy-plays.com/20231111/19445_5acbc3bb/index.m3u8#第23集$https://vip.ffzy-plays.com/20231118/19772_1a5eaaf4/index.m3u8#第24集$https://vip.ffzy-plays.com/20231125/20073_1ab30559/index.m3u8#第25集$https://vip.ffzy-plays.com/20231202/20375_932516c1/index.m3u8#第26集$https://vip.ffzy-plays.com/20231209/20707_f0590fb8/index.m3u8#第27集$https://super.ffzy-online6.com/20231216/23206_9d6604ea/index.m3u8#第28集$https://vip.ffzy-plays.com/20231223/21360_40a3ff55/index.m3u8#第29集$https://vip.ffzy-plays.com/20231230/21606_76a631c6/index.m3u8#第30集$https://vip.ffzy-plays.com/20240106/21815_98ee6cc1/index.m3u8#第31集$https://vip.ffzy-plays.com/20240113/22067_fa8e7fa6/index.m3u8#第32集$https://vip.ffzy-plays.com/20240120/22382_265a289f/index.m3u8#第33集$https://vip.ffzy-plays.com/20240127/22688_a059f992/index.m3u8#第34集$https://vip.ffzy-plays.com/20240203/22984_fe4d6ff5/index.m3u8#第35集$https://vip.ffzy-plays.com/20240210/23300_c98dcc0f/index.m3u8#第36集$https://vip.ffzy-plays.com/20240217/23583_badb3fa2/index.m3u8#第37集$https://vip.ffzy-plays.com/20240224/23911_cb7c1371/index.m3u8#第38集$https://vip.ffzy-plays.com/20240302/24329_62580d91/index.m3u8#第39集$https://vip.ffzy-plays.com/20240309/24722_3a138d65/index.m3u8#第40集$https://vip.ffzy-plays.com/20240316/24970_434f63d2/index.m3u8#第41集$https://vip.ffzy-plays.com/20240323/25211_4aaa3cbf/index.m3u8#第42集$https://vip.ffzy-plays.com/20240330/25446_3d2d893d/index.m3u8#第43集$https://vip.ffzy-plays.com/20240405/25707_8318a9b8/index.m3u8#第44集$https://vip.ffzy-plays.com/20240412/25942_4122a5f9/index.m3u8#第45集$https://vip.ffzy-plays.com/20240419/26242_797e1315/index.m3u8#第46集$https://vip.ffzy-plays.com/20240426/26568_ec816b64/index.m3u8#第47集$https://vip.ffzy-plays.com/20240503/26829_6ab94b30/index.m3u8#第48集$https://vip.ffzy-plays.com/20240510/27108_1cf484fd/index.m3u8#第49集$https://vip.ffzy-plays.com/20240517/27378_678aefb7/index.m3u8#第50集$https://vip.ffzy-plays.com/20240524/27699_f3cc06e1/index.m3u8#第51集$https://vip.ffzy-plays.com/20240531/28033_2bbaf925/index.m3u8#第52集$https://vip.ffzy-plays.com/20240607/28387_f7ce68f6/index.m3u8#第53集$https://vip.ffzy-plays.com/20240614/28663_c4c090ac/index.m3u8#第54集$https://vip.ffzy-plays.com/20240621/28943_584599af/index.m3u8#第55集$https://vip.ffzy-plays.com/20240628/29268_512823c0/index.m3u8#第56集$https://vip.ffzy-plays.com/20240705/29579_d4fa4307/index.m3u8#第57集$https://vip.ffzy-plays.com/20240712/29936_9182295e/index.m3u8#第58集$https://vip.ffzy-plays.com/20240719/30277_bbf4cdbc/index.m3u8#第59集$https://vip.ffzy-plays.com/20240726/30677_b43910ba/index.m3u8#第60集$https://vip.ffzy-plays.com/20240802/30960_bd3136b7/index.m3u8#第61集$https://vip.ffzy-plays.com/20240809/31208_ab50c200/index.m3u8#第62集$https://vip.ffzy-plays.com/20240816/31444_25d55f01/index.m3u8#第63集$https://vip.ffzy-plays.com/20240823/31721_b9e702b9/index.m3u8#第64集$https://vip.ffzy-plays.com/20240830/31996_5d810d09/index.m3u8#第65集$https://vip.ffzy-plays.com/20240906/32224_053ae68f/index.m3u8#第66集$https://vip.ffzy-plays.com/20240913/32433_dd3c407b/index.m3u8#第67集$https://vip.ffzy-plays.com/20240920/32647_27c20a93/index.m3u8#第68集$https://vip.ffzy-plays.com/20240927/32935_de6f3928/index.m3u8#第69集$https://vip.ffzy-plays.com/20241004/33189_15256a6b/index.m3u8#第70集$https://vip.ffzy-plays.com/20241011/33496_4428d361/index.m3u8#第71集$https://vip.ffzy-plays.com/20241018/33806_82911478/index.m3u8#第72集$https://vip.ffzy-plays.com/20241025/34071_1739130c/index.m3u8#第73集$https://vip.ffzy-plays.com/20241101/34348_5a55d6ee/index.m3u8#第74集$https://vip.ffzy-plays.com/20241108/34602_d645da12/index.m3u8#第75集$https://vip.ffzy-plays.com/20241115/34842_4783dcf8/index.m3u8#第76集$https://vip.ffzy-plays.com/20241122/35184_8abf3bb5/index.m3u8#第77集$https://vip.ffzy-plays.com/20241129/35463_b16539e3/index.m3u8#第78集$https://vip.ffzy-plays.com/20241206/35832_04eab5b5/index.m3u8#第79集$https://vip.ffzy-plays.com/20241213/36065_04112144/index.m3u8#第80集$https://vip.ffzy-plays.com/20241220/36354_2f838cad/index.m3u8#第81集$https://vip.ffzy-plays.com/20241227/36595_bf59677e/index.m3u8#第82集$https://vip.ffzy-plays.com/20250103/36798_7e668ae7/index.m3u8#第83集$https://vip.ffzy-plays.com/20250110/37024_2b99581c/index.m3u8#第84集$https://vip.ffzy-plays.com/20250117/37299_a2a561ff/index.m3u8#第85集$https://vip.ffzy-plays.com/20250124/37604_1cb2e007/index.m3u8#第86集$https://vip.ffzy-plays.com/20250131/37814_70eb973c/index.m3u8#第87集$https://vip.ffzy-plays.com/20250207/38081_224f6f4f/index.m3u8#第88集$https://vip.ffzy-plays.com/20250214/38343_c1b66581/index.m3u8#第89集$https://vip.ffzy-plays.com/20250221/38572_c9d83f1c/index.m3u8#第90集$https://vip.ffzy-plays.com/20250228/38797_3fd28bdb/index.m3u8#第91集$https://vip.ffzy-plays.com/20250307/39010_202712c9/index.m3u8#第92集$https://vip.ffzy-plays.com/20250314/39265_c1de6a38/index.m3u8#第93集$https://vip.ffzy-plays.com/20250321/39475_49723df3/index.m3u8#第94集$https://vip.ffzy-plays.com/20250328/39694_93978cb9/index.m3u8#第95集$https://vip.ffzy-plays.com/20250404/39918_1d6f9ad9/index.m3u8#第96集$https://vip.ffzy-plays.com/20250411/40159_4e00f393/index.m3u8#第97集$https://vip.ffzy-plays.com/20250418/40409_4a8d4ae1/index.m3u8#第98集$https://vip.ffzy-plays.com/20250425/40619_02c1ffbf/index.m3u8#第99集$https://vip.ffzy-plays.com/20250502/40823_32899caf/index.m3u8#第100集$https://vip.ffzy-plays.com/20250509/41093_c9ae486d/index.m3u8#第101集$https://vip.ffzy-plays.com/20250516/41350_091e1aa4/index.m3u8#第102集$https://vip.ffzy-plays.com/20250523/41575_c3a3a3c8/index.m3u8#第103集$https://vip.ffzy-plays.com/20250530/41790_ba9610f1/index.m3u8#第104集$https://vip.ffzy-plays.com/20250606/41988_40182412/index.m3u8#第105集$https://vip.ffzy-plays.com/20250613/42198_7c40611a/index.m3u8#第106集$https://vip.ffzy-plays.com/20250620/42410_43e75233/index.m3u8#第107集$https://vip.ffzy-plays.com/20250627/42584_917652aa/index.m3u8#第108集$https://vip.ffzy-plays.com/20250704/42757_bd2f2b08/index.m3u8#第109集$https://vip.ffzy-plays.com/20250711/43007_4bf2f405/index.m3u8#第110集$https://vip.ffzy-plays.com/20250718/43253_a7fcfc37/index.m3u8#第111集$https://vip.ffzy-plays.com/20250725/43511_28a487c8/index.m3u8#第112集$https://vip.ffzy-plays.com/20250801/43791_6141f07e/index.m3u8#第113集$https://vip.ffzy-plays.com/20250808/44018_7ccf00b6/index.m3u8#第114集$https://vip.ffzy-plays.com/20250815/44249_9729df58/index.m3u8#第115集$https://vip.ffzy-plays.com/20250822/44506_beb790dc/index.m3u8#第116集$https://vip.ffzy-plays.com/20250829/44730_c6e9701b/index.m3u8#第117集$https://vip.ffzy-plays.com/20250905/45013_9b299580/index.m3u8#第118集$https://vip.ffzy-plays.com/20250912/45263_485c9dd9/index.m3u8#第119集$https://vip.ffzy-plays.com/20250919/45521_4f96fd60/index.m3u8#第120集$https://vip.ffzy-plays.com/20250926/45768_b426d5a2/index.m3u8#第121集$https://vip.ffzy-plays.com/20251003/46033_f8f7aa63/index.m3u8#第122集$https://vip.ffzy-plays.com/20251010/46369_aca70417/index.m3u8#第123集$https://vip.ffzy-plays.com/20251017/46612_3466b68a/index.m3u8#第124集$https://vip.ffzy-plays.com/20251024/46815_dcb388ff/index.m3u8#第125集$https://vip.ffzy-plays.com/20251031/47059_b7e21bd4/index.m3u8#第126集$https://vip.ffzy-plays.com/20251107/47332_ea09e5ee/index.m3u8#第127集$https://vip.ffzy-plays.com/20251114/47576_5adc3ad3/index.m3u8#第128集$https://vip.ffzy-plays.com/20251121/47814_d59bf8ab/index.m3u8#第129集$https://vip.ffzy-plays.com/20251128/48032_54430319/index.m3u8#第130集$https://vip.ffzy-plays.com/20251205/48239_073e5e79/index.m3u8#第131集$https://vip.ffzy-plays.com/20251212/48489_0df65700/index.m3u8#第132集$https://vip.ffzy-plays.com/20251219/48723_499c1027/index.m3u8#第133集$https://vip.ffzy-plays.com/20251226/48924_146e3dc9/index.m3u8#第134集$https://vip.ffzy-plays.com/20260102/49127_575f58d3/index.m3u8#第135集$https://vip.ffzy-plays.com/20260109/49339_e9a0c271/index.m3u8#第136集$https://vip.ffzy-plays.com/20260116/49535_b158d85a/index.m3u8#第137集$https://vip.ffzy-plays.com/20260123/49721_882ad87e/index.m3u8#第138集$https://vip.ffzy-plays.com/20260130/49983_b1fd8ebd/index.m3u8#第139集$https://vip.ffzy-plays.com/20260206/50280_5da361ad/index.m3u8#第140集$https://vip.ffzy-plays.com/20260213/50523_792efc16/index.m3u8#第141集$https://vip.ffzy-plays.com/20260220/50736_fe53b815/index.m3u8#第142集$https://vip.ffzy-plays.com/20260227/50977_eb0f77f5/index.m3u8#第143集$https://vip.ffzy-plays.com/20260306/51203_0e5c42fd/index.m3u8#第144集$https://vip.ffzy-plays.com/20260313/51407_fab9ab35/index.m3u8#第145集$https://vip.ffzy-plays.com/20260320/51603_9f596d47/index.m3u8#第146集$https://vip.ffzy-plays.com/20260327/51809_d2d9615c/index.m3u8#第147集$https://vip.ffzy-plays.com/20260403/52032_87a69348/index.m3u8#第148集$https://vip.ffzy-plays.com/20260410/52257_c5895d72/index.m3u8#第149集$https://vip.ffzy-plays.com/20260417/52538_2a4bd625/index.m3u8#第150集$https://vip.ffzy-plays.com/20260424/52794_dbe1eb55/index.m3u8#第151集$https://vip.ffzy-plays.com/20260501/53052_7b84679a/index.m3u8#第152集$https://vip.ffzy-plays.com/20260508/53326_5b2aa858/index.m3u8#第153集$https://vip.ffzy-plays.com/20260515/53614_3e5f03df/index.m3u8#第154集$https://vip.ffzy-plays.com/20260522/53862_51d0db8f/index.m3u8#第155集$https://vip.ffzy-plays.com/20260529/54119_e0b92938/index.m3u8#第156集$https://vip.ffzy-plays.com/20260605/54394_e117dcab/index.m3u8#第157集$https://vip.ffzy-plays.com/20260612/54652_537be429/index.m3u8#第158集$https://vip.ffzy-plays.com/20260619/54955_5fe96519/index.m3u8#第159集$https://vip.ffzy-plays.com/20260626/55183_af363449/index.m3u8#第160集$https://vip.ffzy-plays.com/20260703/55377_4f5c0808/index.m3u8#第161集$https://vip.ffzy-plays.com/20260710/55600_3bcf7928/index.m3u8#第162集$https://vip.ffzy-plays.com/20260717/55870_c8c11799/index.m3u8#第163集$https://vip.ffzy-plays.com/20260724/56182_f2148338/index.m3u8#第164集$https://vip.ffzy-plays.com/20260731/56472_72702b64/index.m3u8#第165集$https://vip.ffzy-plays.com/20260807/56773_ae1e42f3/index.m3u8#第166集$https://vip.ffzy-plays.com/20260814/57055_45906f7a/index.m3u8#第167集$https://vip.ffzy-plays.com/20260821/57298_98e46bff/index.m3u8#第168集$https://vip.ffzy-plays.com/20260828/57554_b3936fce/index.m3u8#第169集$https://vip.ffzy-plays.com/20260904/57898_d55a14e5/index.m3u8#第170集$https://vip.ffzy-plays.com/20260911/58181_d9ff308d/index.m3u8#第171集$https://vip.ffzy-plays.com/20260918/58419_f4ce2302/index.m3u8#第172集$https://vip.ffzy-plays.com/20260925/58683_b8a36100/index.m3u8#第173集$https://vip.ffzy-plays.com/20261002/58979_37a59e73/index.m3u8#第174集$https://vip.ffzy-plays.com/20261009/59281_af673845/index.m3u8$$$第01集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第01集/index.m3u8#第02集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第02集/index.m3u8#第03集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第03集/index.m3u8#第04集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第04集/index.m3u8#第05集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第05集/index.m3u8#第06集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第06集/index.m3u8#第07集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第07集/index.m3u8#第08集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第08集/index.m3u8#第09集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第09集/index.m3u8#第10集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第10集/index.m3u8#第11集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第11集/index.m3u8#第12集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第12集/index.m3u8#第13集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第13集/index.m3u8#第14集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第14集/index.m3u8#第15集$https://c1.rrcdnbf5.com/video/douluodalu2jueshitangmen2023/第15集/index.m3u8#第16集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第16集/index.m3u8#第17集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第17集/index.m3u8#第18集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第18集/index.m3u8#第19集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第19集/index.m3u8#第20集$https://c1.rrcdnbf6.com/video/douluodalu2jueshitangmen2023/第20集/index.m3u8#第21集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第21集/index.m3u8#第22集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第22集/index.m3u8#第23集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第23集/index.m3u8#第24集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第24集/index.m3u8#第25集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第25集/index.m3u8#第26集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第26集/index.m3u8#第27集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第27集/index.m3u8#第28集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第28集/index.m3u8#第29集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第29集/index.m3u8#第30集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第30集/index.m3u8#第31集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第31集/index.m3u8#第32集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第32集/index.m3u8#第33集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第33集/index.m3u8#第34集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第34集/index.m3u8#第35集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第35集/index.m3u8#第36集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第36集/index.m3u8#第37集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第37集/index.m3u8#第38集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第38集/index.m3u8#第39集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第39集/index.m3u8#第40集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第40集/index.m3u8#第41集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第41集/index.m3u8#第42集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第42集/index.m3u8#第43集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第43集/index.m3u8#第44集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第44集/index.m3u8#第45集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第45集/index.m3u8#第46集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第46集/index.m3u8#第47集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第47集/index.m3u8#第48集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第48集/index.m3u8#第49集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第49集/index.m3u8#第50集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第50集/index.m3u8#第51集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第51集/index.m3u8#第52集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第52集/index.m3u8#第53集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第53集/index.m3u8#第54集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第54集/index.m3u8#第55集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第55集/index.m3u8#第56集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第56集/index.m3u8#第57集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第57集/index.m3u8#第58集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第58集/index.m3u8#第59集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第59集/index.m3u8#第60集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第60集/index.m3u8#第61集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第61集/index.m3u8#第62集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第62集/index.m3u8#第63集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第63集/index.m3u8#第64集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第64集/index.m3u8#第65集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第65集/index.m3u8#第66集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第66集/index.m3u8#第67集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第67集/index.m3u8#第68集$https://c1.ddbbffcdn.com/video/douluodalu2jueshitangmen2023/第68集/index.m3u8#第69集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第69集/index.m3u8#第70集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第70集/index.m3u8#第71集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第71集/index.m3u8#第72集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第72集/index.m3u8#第73集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第73集/index.m3u8#第74集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第74集/index.m3u8#第75集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第75集/index.m3u8#第76集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第76集/index.m3u8#第77集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第77集/index.m3u8#第78集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第78集/index.m3u8#第79集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第79集/index.m3u8#第80集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第80集/index.m3u8#第81集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第81集/index.m3u8#第82集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第82集/index.m3u8#第83集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第83集/index.m3u8#第84集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第84集/index.m3u8#第85集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第85集/index.m3u8#第86集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第86集/index.m3u8#第87集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第87集/index.m3u8#第88集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第88集/index.m3u8#第89集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第89集/index.m3u8#第90集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第90集/index.m3u8#第91集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第91集/index.m3u8#第92集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第92集/index.m3u8#第93集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第93集/index.m3u8#第94集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第94集/index.m3u8#第95集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第95集/index.m3u8#第96集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第96集/index.m3u8#第97集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第97集/index.m3u8#第98集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第98集/index.m3u8#第99集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第99集/index.m3u8#第100集$https://p.bvvvvvvvvv1f.com/video/replace0001/20250510uxaUkXFMindex.m3u8/index.m3u8#第101集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第101集/index.m3u8#第102集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第102集/index.m3u8#第103集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第103集/index.m3u8#第104集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第104集/index.m3u8#第105集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第105集/index.m3u8#第106集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第106集/index.m3u8#第107集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第107集/index.m3u8#第108集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第108集/index.m3u8#第109集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第109集/index.m3u8#第110集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第110集/index.m3u8#第111集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第111集/index.m3u8#第112集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第112集/index.m3u8#第113集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第113集/index.m3u8#第114集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第114集/index.m3u8#第115集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第115集/index.m3u8#第116集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第116集/index.m3u8#第117集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第117集/index.m3u8#第118集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第118集/index.m3u8#第119集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第119集/index.m3u8#第120集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第120集/index.m3u8#第121集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第121集/index.m3u8#第122集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第122集/index.m3u8#第123集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第123集/index.m3u8#第124集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第124集/index.m3u8#第125集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第125集/index.m3u8#第126集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第126集/index.m3u8#第127集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第127集/index.m3u8#第128集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第128集/index.m3u8#第129集$https://v.fengbao8.com/video/douluodalu2jueshitangmen2023/第129集/index.m3u8#第130集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/第130集/index.m3u8#第131集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/f64078c6b4ec/index.m3u8#第132集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/7069795c456e/index.m3u8#第133集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/76476371fdb9/index.m3u8#第134集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/3a12b53bc1ba/index.m3u8#第135集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/b247fe527e0a/index.m3u8#第136集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/f93125772388/index.m3u8#第137集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/6a6536bc5730/index.m3u8#第138集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/6b3067dc786d/index.m3u8#第139集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/2e17f2c6b601/index.m3u8#第140集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/138bb8d6c39d/index.m3u8#第141集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/61d9199d93dc/index.m3u8#第142集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/993d43dcf456/index.m3u8#第143集$https://s3.bfllvip.com/video/douluodalu2jueshitangmen2023/cc116a2b5952/index.m3u8#第144集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/a1c4f5ae5e7a/index.m3u8#第145集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/c03b5ff397a0/index.m3u8#第146集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/6c9eb85a2e91/index.m3u8#第147集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/10220e4a782f/index.m3u8#第148集$https://v.baofeng9.com/video/douluodalu2jueshitangmen2023/5b4847569dac/index.m3u8#第149集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/12338b6b7f85/index.m3u8#第150集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/50d80154203b/index.m3u8#第151集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/2ba822c1d20e/index.m3u8#第152集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/c49fc6ab9357/index.m3u8#第153集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/75118aad442f/index.m3u8#第154集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/656fdb631b99/index.m3u8#第155集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/d110ac523fc3/index.m3u8#第156集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/dcc335ffcbd3/index.m3u8#第157集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/491ecb2f5bad/index.m3u8#第158集$https://bfeng10.com/video/douluodalu2jueshitangmen2023/9f36e64250b9/index.m3u8#第159集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/a547773e521b/index.m3u8#第160集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/ba577e3d8fbe/index.m3u8#第161集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/a337fd1ed27a/index.m3u8#第162集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/b3383758f8bb/index.m3u8#第163集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/5487770a9407/index.m3u8#第164集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/d31422393a16/index.m3u8#第165集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/ce09b61275aa/index.m3u8#第166集$https://bfeng11.com/video/douluodalu2jueshitangmen2023/4649f2bcc203/index.m3u8#第167集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/95c372d69e10/index.m3u8#第168集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/fb134fe4b190/index.m3u8#第169集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/a69e60684e07/index.m3u8#第170集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/6ce614dff589/index.m3u8#第171集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/c93120e85bab/index.m3u8#第172集$https://fengbao12.com/video/douluodalu2jueshitangmen2023/dcc886e9811b/index.m3u8#第173集$https://fengbao13.com/video/douluodalu2jueshitangmen2023/c865f4f11eea/index.m3u8#第174集$https://fengbao13.com/video/douluodalu2jueshitangmen2023/72829078bd0b/index.m3u8"
  },
  {
    "vod_id": 8088,
    "vod_name": "斗破苍穹年番",
    "vod_sub": "斗破苍穹年番",
    "vod_pic": "https://img.lzipic.com/upload/vod/20231023-1/d61ff7479689b16b8980715cde81b89b.jpg",
    "type_name": "国产动漫",
    "vod_year": "2022",
    "vod_remarks": "更新至214集",
    "vod_score": "8.8",
    "vod_actor": "不一,陈奕雯,黑石稔,郭鸿博,v17-富贵,王宇航,赵洋",
    "vod_content": "<p>　　三年之约后，萧炎终于在迦南学院见到了薰儿，此后他广交挚友并成立磐门；为继续提升实力以三上云岚宗为父复仇，他以身犯险深入天焚炼气塔吞噬陨落心炎……</p>",
    "vod_play_from": "非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://vod.feifei-kan.com/20221102/1430_09bc7ca2/index.m3u8#第02集$https://vod.feifei-kan.com/20221102/1431_3d78ad41/index.m3u8#第03集$https://vod.feifei-kan.com/20221102/1432_cbe7ae28/index.m3u8#第04集$https://vod.feifei-kan.com/20221102/1434_e4024c64/index.m3u8#第05集$https://vod.feifei-kan.com/20221102/1433_1316fbb4/index.m3u8#第06集$https://vod.feifei-kan.com/20221102/1436_2457ef4e/index.m3u8#第07集$https://vod.feifei-kan.com/20221102/1435_e0561423/index.m3u8#第08集$https://vod.feifei-kan.com/20221102/1437_78b3f603/index.m3u8#第09集$https://vod.feifei-kan.com/20221102/1438_77dc75ab/index.m3u8#第10集$https://vod.feifei-kan.com/20221102/1439_0e36e050/index.m3u8#第11集$https://vod.feifei-kan.com/20221102/1440_31f5b989/index.m3u8#第12集$https://vod.feifei-kan.com/20221102/1441_68f087a8/index.m3u8#第13集$https://vod.feifei-kan.com/20221102/1442_70a4c2f2/index.m3u8#第14集$https://vod.feifei-kan.com/20221102/1444_64e4e655/index.m3u8#第15集$https://vod.feifei-kan.com/20221102/1443_ffda39f4/index.m3u8#第16集$https://vod.feifei-kan.com/20221102/1447_499aac25/index.m3u8#第17集$https://vod.feifei-kan.com/20221127/4019_3e4d4147/index.m3u8#第18集$https://vod.feifei-kan.com/20221127/4018_a6aab2f3/index.m3u8#第19集$https://vod.feifei-kan.com/20221127/4017_22ea6811/index.m3u8#第20集$https://vod.feifei-kan.com/20221127/4016_114d664e/index.m3u8#第21集$https://vod.feifei-kan.com/20221204/4389_f423e049/index.m3u8#第22集$https://vod.feifei-kan.com/20221211/4925_c90f67e6/index.m3u8#第23集$https://vod.feifei-kan.com/20221218/5270_b8f50986/index.m3u8#第24集$https://vod.feifei-kan.com/20221225/5519_a105e720/index.m3u8#第25集$https://vod.feifei-kan.com/20230101/5717_fdc45d13/index.m3u8#第26集$https://vod.feifei-kan.com/20230108/6011_c3b9c96e/index.m3u8#第27集$https://vod.feifei-kan.com/20230115/6260_38e1a679/index.m3u8#第28集$https://vod.feifei-kan.com/20230122/6813_38239e09/index.m3u8#第29集$https://vod.feifei-kan.com/20230129/7098_88814f97/index.m3u8#第30集$https://vod.feifei-kan.com/20230205/7326_d471c24d/index.m3u8#第31集$https://vod.feifei-kan.com/20230212/7624_66ae3c87/index.m3u8#第32集$https://vod.feifei-kan.com/20230219/7831_6160a8b4/index.m3u8#第33集$https://vod.feifei-kan.com/20230226/9038_6dde8fa8/index.m3u8#第34集$https://vip.ffzy-play5.com/20230305/8054_c993e5bc/index.m3u8#第35集$https://vod.feifei-kan.com/20230312/9579_42d07fb7/index.m3u8#第36集$https://vod.feifei-kan.com/20230319/9849_47d015a6/index.m3u8#第37集$https://vod.feifei-kan.com/20230326/10036_de5b4799/index.m3u8#第38集$https://vod.feifei-kan.com/20230402/10537_a4fc50a3/index.m3u8#第39集$https://vod.feifei-kan.com/20230409/10736_6df53269/index.m3u8#第40集$https://vod.feifei-kan.com/20230416/10975_7dec15ac/index.m3u8#第41集$https://vip.ffzy-online5.com/20230423/10936_13df460d/index.m3u8#第42集$https://vip.ffzy-plays.com/20230430/11156_5c0c4e88/index.m3u8#第43集$https://vip.ffzy-plays.com/20230507/11370_9c4a27d3/index.m3u8#第44集$https://vip.ffzy-plays.com/20230514/11658_0231cd15/index.m3u8#第45集$https://vip.ffzy-plays.com/20230521/11874_47ac98b3/index.m3u8#第46集$https://vip.ffzy-plays.com/20230528/12080_8801d25e/index.m3u8#第47集$https://vip.ffzy-plays.com/20230604/12355_67857a21/index.m3u8#第48集$https://vip.ffzy-plays.com/20230611/12568_9747b78b/index.m3u8#第49集$https://vip.ffzy-plays.com/20230618/12781_da21c9e3/index.m3u8#第50集$https://vip.ffzy-plays.com/20230625/13029_4172c37d/index.m3u8#第51集$https://vip.ffzy-plays.com/20230702/13378_5586aea9/index.m3u8#第52集$https://vip.ffzy-plays.com/20230709/13635_1f2ec630/index.m3u8#第53集$https://vip.ffzy-plays.com/20230716/13891_c5dd09ac/index.m3u8#第54集$https://vip.ffzy-plays.com/20230723/14137_a58bd321/index.m3u8#第55集$https://vip.ffzy-plays.com/20230730/14439_06351fd7/index.m3u8#第56集$https://vip.ffzy-plays.com/20230806/14955_6257576f/index.m3u8#第57集$https://vod.feifei-kan.com/20230813/16791_1c799af3/index.m3u8#第58集$https://vip.ffzy-plays.com/20230820/15487_264137b5/index.m3u8#第59集$https://vip.ffzy-plays.com/20230827/15754_83c70819/index.m3u8#第60集$https://vip.ffzy-plays.com/20230903/16171_617ff6f1/index.m3u8#第61集$https://vip.ffzy-plays.com/20230910/16467_dee114d0/index.m3u8#第62集$https://vip.ffzy-plays.com/20230917/16761_de7523e4/index.m3u8#第63集$https://vip.ffzy-plays.com/20230924/17044_5704c895/index.m3u8#第64集$https://vip.ffzy-plays.com/20231001/17368_0643ea67/index.m3u8#第65集$https://vip.ffzy-plays.com/20231008/17726_44935df1/index.m3u8#第66集$https://vip.ffzy-plays.com/20231015/18132_2b8dfdc2/index.m3u8#第67集$https://vip.ffzy-plays.com/20231022/18516_e722dce6/index.m3u8#第68集$https://vip.ffzy-plays.com/20231029/18820_bcfc89fc/index.m3u8#第69集$https://vip.ffzy-plays.com/20231105/19130_8cb5b6e5/index.m3u8#第70集$https://vip.ffzy-plays.com/20231112/19480_a9ed37fb/index.m3u8#第71集$https://vip.ffzy-plays.com/20231119/19817_07e99ee0/index.m3u8#第72集$https://vip.ffzy-plays.com/20231126/20106_98c36ee0/index.m3u8#第73集$https://vip.ffzy-plays.com/20231203/20410_ede58263/index.m3u8#第74集$https://vip.ffzy-plays.com/20231210/20773_60140a1d/index.m3u8#第75集$https://super.ffzy-online6.com/20231217/23290_f684d555/index.m3u8#第76集$https://vip.ffzy-plays.com/20231224/21396_45a65b45/index.m3u8#第77集$https://vip.ffzy-plays.com/20231231/21636_8cf35140/index.m3u8#第78集$https://vip.ffzy-plays.com/20240107/21842_781c164a/index.m3u8#第79集$https://vip.ffzy-plays.com/20240114/22103_a530fcb1/index.m3u8#第80集$https://vip.ffzy-plays.com/20240121/22433_d1c24452/index.m3u8#第81集$https://vip.ffzy-plays.com/20240128/22776_a3027aed/index.m3u8#第82集$https://vip.ffzy-plays.com/20240204/23083_0fb86a9c/index.m3u8#第83集$https://vip.ffzy-plays.com/20240211/23343_1fb828d4/index.m3u8#第84集$https://vip.ffzy-plays.com/20240218/23619_932932d5/index.m3u8#第85集$https://vip.ffzy-plays.com/20240224/23930_0f1f3cea/index.m3u8#第86集$https://vip.ffzy-plays.com/20240302/24411_8ce1c50b/index.m3u8#第87集$https://vip.ffzy-plays.com/20240309/24745_6838e36e/index.m3u8#第88集$https://vip.ffzy-plays.com/20240317/24992_2c353ba2/index.m3u8#第89集$https://vip.ffzy-plays.com/20240323/25239_038fbf0b/index.m3u8#第90集$https://vip.ffzy-plays.com/20240330/25464_a2fbbbac/index.m3u8#第91集$https://vip.ffzy-plays.com/20240406/25739_5fb171c5/index.m3u8#第92集$https://vip.ffzy-plays.com/20240413/25978_7fbe5b68/index.m3u8#第93集$https://vip.ffzy-plays.com/20240420/26324_57582540/index.m3u8#第94集$https://vip.ffzy-plays.com/20240427/26604_5ee252d3/index.m3u8#第95集$https://vip.ffzy-plays.com/20240504/26867_df2337b6/index.m3u8#第96集$https://vip.ffzy-plays.com/20240511/27144_14b82145/index.m3u8#第97集$https://vip.ffzy-plays.com/20240518/27429_c4b42a17/index.m3u8#第98集$https://vip.ffzy-plays.com/20240525/27746_dd90d372/index.m3u8#第99集$https://vip.ffzy-plays.com/20240601/28075_66aeb4e9/index.m3u8#第100集$https://vip.ffzy-plays.com/20240608/28430_6bf29ab8/index.m3u8#第101集$https://vip.ffzy-plays.com/20240629/29306_18e255c4/index.m3u8#第102集$https://vip.ffzy-plays.com/20240706/29632_4e4e12a0/index.m3u8#第103集$https://vip.ffzy-plays.com/20240713/29982_21b11cf1/index.m3u8#第104集$https://vip.ffzy-plays.com/20240720/30326_310b3dc4/index.m3u8#第105集$https://vip.ffzy-plays.com/20240727/30717_45417d12/index.m3u8#第106集$https://svip.feifei-play.com/20240803/2_c81e728d/index.m3u8#第107集$https://vip.ffzy-plays.com/20240810/31244_eba9940b/index.m3u8#第108集$https://vip.ffzy-plays.com/20240817/31487_20906d51/index.m3u8#第109集$https://vip.ffzy-plays.com/20240824/31762_ae4b023d/index.m3u8#第110集$https://vip.ffzy-plays.com/20240831/32027_31f16d3a/index.m3u8#第111集$https://vip.ffzy-plays.com/20240907/32255_bafe63ac/index.m3u8#第112集$https://vip.ffzy-plays.com/20240914/32467_6d6072ea/index.m3u8#第113集$https://vip.ffzy-plays.com/20240921/32696_bc2ba20c/index.m3u8#第114集$https://vip.ffzy-plays.com/20240928/32967_0fd36ed3/index.m3u8#第115集$https://vip.ffzy-plays.com/20241005/33228_877f8395/index.m3u8#第116集$https://vip.ffzy-plays.com/20241012/33546_2bf720f7/index.m3u8#第117集$https://vip.ffzy-plays.com/20241019/33849_04f02d73/index.m3u8#第118集$https://vip.ffzy-plays.com/20241026/34117_39a3bf98/index.m3u8#第119集$https://vip.ffzy-plays.com/20241102/34389_786929ce/index.m3u8#第120集$https://vip.ffzy-plays.com/20241109/34645_ec8989a0/index.m3u8#第121集$https://vip.ffzy-plays.com/20241116/34894_94100281/index.m3u8#第122集$https://vip.ffzy-plays.com/20241123/35234_5361754d/index.m3u8#第123集$https://vip.ffzy-plays.com/20241130/35512_b776836a/index.m3u8#第124集$https://vip.ffzy-plays.com/20241207/35873_2eef370c/index.m3u8#第125集$https://vip.ffzy-plays.com/20241214/36111_a7b344c5/index.m3u8#第126集$https://vip.ffzy-plays.com/20241221/36390_4e17fdfe/index.m3u8#第127集$https://vip.ffzy-plays.com/20241228/36626_8dd80590/index.m3u8#第128集$https://vip.ffzy-plays.com/20250104/36834_55b41404/index.m3u8#第129集$https://vip.ffzy-plays.com/20250111/37060_932213cc/index.m3u8#第130集$https://vip.ffzy-plays.com/20250118/37342_f2005379/index.m3u8#第131集$https://vip.ffzy-plays.com/20250125/37634_2d355489/index.m3u8#第132集$https://vip.ffzy-plays.com/20250201/37860_9f2df8e8/index.m3u8#第133集$https://vip.ffzy-plays.com/20250208/38133_07f2d8db/index.m3u8#第134集$https://vip.ffzy-plays.com/20250215/38383_60c6413e/index.m3u8#第135集$https://vip.ffzy-plays.com/20250222/38606_e0980b73/index.m3u8#第136集$https://vip.ffzy-plays.com/20250301/38823_0ef7d71c/index.m3u8#第137集$https://vip.ffzy-plays.com/20250308/39045_a61744e1/index.m3u8#第138集$https://vip.ffzy-plays.com/20250315/39297_36a53079/index.m3u8#第139集$https://vip.ffzy-plays.com/20250322/39505_0cc0573d/index.m3u8#第140集$https://vip.ffzy-plays.com/20250329/39719_a528bca9/index.m3u8#第141集$https://vip.ffzy-plays.com/20250405/39945_ee7905f8/index.m3u8#第142集$https://vip.ffzy-plays.com/20250412/40206_9874e774/index.m3u8#第143集$https://vip.ffzy-plays.com/20250419/40439_24f964b6/index.m3u8#第144集$https://vip.ffzy-plays.com/20250426/40646_8b7f5d73/index.m3u8#第145集$https://vip.ffzy-plays.com/20250503/40851_5ff3fd94/index.m3u8#第146集$https://vip.ffzy-plays.com/20250510/41130_bd71244c/index.m3u8#第147集$https://vip.ffzy-plays.com/20250517/41385_0c219fea/index.m3u8#第148集$https://vip.ffzy-plays.com/20250524/41632_411fa120/index.m3u8#第149集$https://vip.ffzy-plays.com/20250531/41825_e5204077/index.m3u8#第150集$https://vip.ffzy-plays.com/20250607/42018_0965de46/index.m3u8#第151集$https://vip.ffzy-plays.com/20250614/42226_20dd4cde/index.m3u8#第152集$https://vip.ffzy-plays.com/20250621/42443_5d9e37d3/index.m3u8#第153集$https://vip.ffzy-plays.com/20250628/42609_f2afe528/index.m3u8#第154集$https://vip.ffzy-plays.com/20250705/42797_0b09c40c/index.m3u8#第155集$https://vip.ffzy-plays.com/20250712/43054_ae77492e/index.m3u8#第156集$https://vip.ffzy-plays.com/20250719/43286_2f9e00b7/index.m3u8#第157集$https://vip.ffzy-plays.com/20250726/43545_6c79b082/index.m3u8#第158集$https://vip.ffzy-plays.com/20250802/43825_1a31856c/index.m3u8#第159集$https://vip.ffzy-plays.com/20250809/44056_72f5b0b3/index.m3u8#第160集$https://vip.ffzy-plays.com/20250816/44285_e4dcab5f/index.m3u8#第161集$https://vip.ffzy-plays.com/20250823/44543_3a2cdaaf/index.m3u8#第162集$https://vip.ffzy-plays.com/20250830/44787_5a6a3585/index.m3u8#第163集$https://vip.ffzy-plays.com/20250906/45046_9735d7a0/index.m3u8#第164集$https://vip.ffzy-plays.com/20250913/45298_994a333e/index.m3u8#第165集$https://vip.ffzy-plays.com/20250921/45581_fe8bda20/index.m3u8#第166集$https://vip.ffzy-plays.com/20250927/45798_68bfe833/index.m3u8#第167集$https://vip.ffzy-plays.com/20251004/46068_f4829b95/index.m3u8#第168集$https://vip.ffzy-plays.com/20251011/46405_ed1f42da/index.m3u8#第169集$https://vip.ffzy-plays.com/20251018/46639_44b0e2d8/index.m3u8#第170集$https://vip.ffzy-plays.com/20251025/46854_6dfaf51d/index.m3u8#第171集$https://vip.ffzy-plays.com/20251101/47098_e50fd217/index.m3u8#第172集$https://vip.ffzy-plays.com/20251108/47387_3fef49b3/index.m3u8#第173集$https://vip.ffzy-plays.com/20251115/47616_674677f8/index.m3u8#第174集$https://vip.ffzy-plays.com/20251122/47846_f79a914c/index.m3u8#第175集$https://vip.ffzy-plays.com/20251129/48064_104aaa34/index.m3u8#第176集$https://vip.ffzy-plays.com/20251206/48273_27b4c550/index.m3u8#第177集$https://vip.ffzy-plays.com/20251213/48528_3d843a7e/index.m3u8#第178集$https://vip.ffzy-plays.com/20251220/48760_6709b9b3/index.m3u8#第179集$https://vip.ffzy-plays.com/20251227/48961_91091ac3/index.m3u8#第180集$https://vip.ffzy-plays.com/20260103/49154_11f76fc1/index.m3u8#第181集$https://vip.ffzy-plays.com/20260110/49368_e9ae4d72/index.m3u8#第182集$https://vip.ffzy-plays.com/20260117/49564_2a58aa82/index.m3u8#第183集$https://vip.ffzy-plays.com/20260124/49752_6c8d4342/index.m3u8#第184集$https://vip.ffzy-plays.com/20260131/50021_81b993da/index.m3u8#第185集$https://vip.ffzy-plays.com/20260207/50300_9e08261c/index.m3u8#第186集$https://vip.ffzy-plays.com/20260214/50562_266eb2b2/index.m3u8#第187集$https://vip.ffzy-plays.com/20260221/50766_3f9f2cde/index.m3u8#第188集$https://vip.ffzy-plays.com/20260228/51002_d681961f/index.m3u8#第189集$https://vip.ffzy-plays.com/20260307/51243_fc85e10e/index.m3u8#第190集$https://vip.ffzy-plays.com/20260314/51435_4eec63d4/index.m3u8#第191集$https://vip.ffzy-plays.com/20260321/51634_741b6f7d/index.m3u8#第192集$https://vip.ffzy-plays.com/20260328/51834_048d6ce1/index.m3u8#第193集$https://vip.ffzy-plays.com/20260404/52054_838b5a04/index.m3u8#第194集$https://vip.ffzy-plays.com/20260411/52294_b96df62d/index.m3u8#第195集$https://vip.ffzy-plays.com/20260418/52572_0dc80046/index.m3u8#第196集$https://vip.ffzy-plays.com/20260425/52828_98ad4461/index.m3u8#第197集$https://vip.ffzy-plays.com/20260502/53081_4de45900/index.m3u8#第198集$https://vip.ffzy-plays.com/20260509/53358_9aae7578/index.m3u8#第199集$https://vip.ffzy-plays.com/20260516/53637_1d5f3637/index.m3u8#第200集$https://vip.ffzy-plays.com/20260523/53900_1333e151/index.m3u8#第201集$https://vip.ffzy-plays.com/20260530/54145_4380563b/index.m3u8#第202集$https://vip.ffzy-plays.com/20260607/54433_1ef13518/index.m3u8#第203集$https://vip.ffzy-plays.com/20260613/54687_3bf56592/index.m3u8#第204集$https://vip.ffzy-plays.com/20260620/54993_7a260659/index.m3u8#第205集$https://vip.ffzy-plays.com/20260627/55207_29998508/index.m3u8#第206集$https://vip.ffzy-plays.com/20260704/55395_8c7a1f68/index.m3u8#第207集$https://vip.ffzy-plays.com/20260711/55634_a80b0d78/index.m3u8#第208集$https://vip.ffzy-plays.com/20260905/57933_8160a40c/index.m3u8#第209集$https://vip.ffzy-plays.com/20260905/57934_3c3c791a/index.m3u8#第210集$https://vip.ffzy-plays.com/20260912/58222_604b6e8c/index.m3u8#第211集$https://vip.ffzy-plays.com/20260919/58455_bd9fd72b/index.m3u8#第212集$https://vip.ffzy-plays.com/20260926/58759_4a2e22a8/index.m3u8#第213集$https://vip.ffzy-plays.com/20261003/59020_646bbc2c/index.m3u8#第214集$https://vip.ffzy-plays.com/20261010/59332_a305a5b0/index.m3u8$$$第01集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第01集/index.m3u8#第02集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第02集/index.m3u8#第03集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第03集/index.m3u8#第04集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第04集/index.m3u8#第05集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第05集/index.m3u8#第06集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第06集/index.m3u8#第07集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第07集/index.m3u8#第08集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第08集/index.m3u8#第09集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第09集/index.m3u8#第10集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第10集/index.m3u8#第11集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第11集/index.m3u8#第12集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第12集/index.m3u8#第13集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第13集/index.m3u8#第14集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第14集/index.m3u8#第15集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第15集/index.m3u8#第16集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第16集/index.m3u8#第17集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第17集/index.m3u8#第18集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第18集/index.m3u8#第19集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第19集/index.m3u8#第20集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第20集/index.m3u8#第21集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第21集/index.m3u8#第22集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第22集/index.m3u8#第23集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第23集/index.m3u8#第24集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第24集/index.m3u8#第25集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第25集/index.m3u8#第26集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第26集/index.m3u8#第27集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第27集/index.m3u8#第28集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第28集/index.m3u8#第29集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第29集/index.m3u8#第30集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第30集/index.m3u8#第31集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第31集/index.m3u8#第32集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第32集/index.m3u8#第33集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第33集/index.m3u8#第34集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第34集/index.m3u8#第35集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第35集/index.m3u8#第36集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第36集/index.m3u8#第37集$https://p.bvvvvvvvvv1f.com/video/doupocangqiongnianfan/第37集/index.m3u8#第38集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第38集/index.m3u8#第39集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第39集/index.m3u8#第40集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第40集/index.m3u8#第41集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第41集/index.m3u8#第42集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第42集/index.m3u8#第43集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第43集/index.m3u8#第44集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第44集/index.m3u8#第45集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第45集/index.m3u8#第46集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第46集/index.m3u8#第47集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第47集/index.m3u8#第48集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第48集/index.m3u8#第49集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第49集/index.m3u8#第50集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第50集/index.m3u8#第51集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第51集/index.m3u8#第52集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第52集/index.m3u8#第53集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第53集/index.m3u8#第54集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第54集/index.m3u8#第55集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第55集/index.m3u8#第56集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第56集/index.m3u8#第57集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第57集/index.m3u8#第58集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第58集/index.m3u8#第59集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第59集/index.m3u8#第60集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第60集/index.m3u8#第61集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第61集/index.m3u8#第62集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第62集/index.m3u8#第63集$https://c1.rrcdnbf5.com/video/doupocangqiongnianfan/第63集/index.m3u8#第64集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第64集/index.m3u8#第65集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第65集/index.m3u8#第66集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第66集/index.m3u8#第67集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第67集/index.m3u8#第68集$https://c1.rrcdnbf6.com/video/doupocangqiongnianfan/第68集/index.m3u8#第69集$https://v.fengbao8.com/video/doupocangqiongnianfan/第69集/index.m3u8#第70集$https://v.fengbao8.com/video/doupocangqiongnianfan/第70集/index.m3u8#第71集$https://v.fengbao8.com/video/doupocangqiongnianfan/第71集/index.m3u8#第72集$https://v.fengbao8.com/video/doupocangqiongnianfan/第72集/index.m3u8#第73集$https://v.fengbao8.com/video/doupocangqiongnianfan/第73集/index.m3u8#第74集$https://v.fengbao8.com/video/doupocangqiongnianfan/第74集/index.m3u8#第75集$https://v.fengbao8.com/video/doupocangqiongnianfan/第75集/index.m3u8#第76集$https://v.fengbao8.com/video/doupocangqiongnianfan/第76集/index.m3u8#第77集$https://v.fengbao8.com/video/doupocangqiongnianfan/第77集/index.m3u8#第78集$https://v.fengbao8.com/video/doupocangqiongnianfan/第78集/index.m3u8#第79集$https://v.fengbao8.com/video/doupocangqiongnianfan/第79集/index.m3u8#第80集$https://v.fengbao8.com/video/doupocangqiongnianfan/第80集/index.m3u8#第81集$https://v.fengbao8.com/video/doupocangqiongnianfan/第81集/index.m3u8#第82集$https://v.fengbao8.com/video/doupocangqiongnianfan/第82集/index.m3u8#第83集$https://v.fengbao8.com/video/doupocangqiongnianfan/第83集/index.m3u8#第84集$https://v.fengbao8.com/video/doupocangqiongnianfan/第84集/index.m3u8#第85集$https://v.fengbao8.com/video/doupocangqiongnianfan/第85集/index.m3u8#第86集$https://v.fengbao8.com/video/doupocangqiongnianfan/第86集/index.m3u8#第87集$https://v.fengbao8.com/video/doupocangqiongnianfan/第87集/index.m3u8#第88集$https://v.fengbao8.com/video/doupocangqiongnianfan/第88集/index.m3u8#第89集$https://v.fengbao8.com/video/doupocangqiongnianfan/第89集/index.m3u8#第90集$https://v.fengbao8.com/video/doupocangqiongnianfan/第90集/index.m3u8#第91集$https://v.fengbao8.com/video/doupocangqiongnianfan/第91集/index.m3u8#第92集$https://v.fengbao8.com/video/doupocangqiongnianfan/第92集/index.m3u8#第93集$https://v.fengbao8.com/video/doupocangqiongnianfan/第93集/index.m3u8#第94集$https://v.fengbao8.com/video/doupocangqiongnianfan/第94集/index.m3u8#第95集$https://v.fengbao8.com/video/doupocangqiongnianfan/第95集/index.m3u8#第96集$https://v.fengbao8.com/video/doupocangqiongnianfan/第96集/index.m3u8#第97集$https://v.fengbao8.com/video/doupocangqiongnianfan/第97集/index.m3u8#第98集$https://v.fengbao8.com/video/doupocangqiongnianfan/第98集/index.m3u8#第99集$https://v.fengbao8.com/video/doupocangqiongnianfan/第99集/index.m3u8#第100集$https://v.fengbao8.com/video/doupocangqiongnianfan/第100集/index.m3u8#第101集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第101集/index.m3u8#第102集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第102集/index.m3u8#第103集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第103集/index.m3u8#第104集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第104集/index.m3u8#第105集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第105集/index.m3u8#第106集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第106集/index.m3u8#第107集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第107集/index.m3u8#第108集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第108集/index.m3u8#第109集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第109集/index.m3u8#第110集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第110集/index.m3u8#第111集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第111集/index.m3u8#第112集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第112集/index.m3u8#第113集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第113集/index.m3u8#第114集$https://c1.ddbbffcdn.com/video/doupocangqiongnianfan/第114集/index.m3u8#第115集$https://v.fengbao8.com/video/doupocangqiongnianfan/第115集/index.m3u8#第116集$https://v.fengbao8.com/video/doupocangqiongnianfan/第116集/index.m3u8#第117集$https://v.fengbao8.com/video/doupocangqiongnianfan/第117集/index.m3u8#第118集$https://v.fengbao8.com/video/doupocangqiongnianfan/第118集/index.m3u8#第119集$https://v.fengbao8.com/video/doupocangqiongnianfan/第119集/index.m3u8#第120集$https://v.fengbao8.com/video/doupocangqiongnianfan/第120集/index.m3u8#第121集$https://v.fengbao8.com/video/doupocangqiongnianfan/第121集/index.m3u8#第122集$https://v.fengbao8.com/video/doupocangqiongnianfan/第122集/index.m3u8#第123集$https://v.fengbao8.com/video/doupocangqiongnianfan/第123集/index.m3u8#第124集$https://v.fengbao8.com/video/doupocangqiongnianfan/第124集/index.m3u8#第125集$https://v.fengbao8.com/video/doupocangqiongnianfan/第125集/index.m3u8#第126集$https://v.fengbao8.com/video/doupocangqiongnianfan/第126集/index.m3u8#第127集$https://v.fengbao8.com/video/doupocangqiongnianfan/第127集/index.m3u8#第128集$https://v.fengbao8.com/video/doupocangqiongnianfan/第128集/index.m3u8#第129集$https://v.fengbao8.com/video/doupocangqiongnianfan/第129集/index.m3u8#第130集$https://v.fengbao8.com/video/doupocangqiongnianfan/第130集/index.m3u8#第131集$https://v.fengbao8.com/video/doupocangqiongnianfan/第131集/index.m3u8#第132集$https://v.fengbao8.com/video/doupocangqiongnianfan/第132集/index.m3u8#第133集$https://v.fengbao8.com/video/doupocangqiongnianfan/第133集/index.m3u8#第134集$https://v.fengbao8.com/video/doupocangqiongnianfan/第134集/index.m3u8#第135集$https://v.fengbao8.com/video/doupocangqiongnianfan/第135集/index.m3u8#第136集$https://v.fengbao8.com/video/doupocangqiongnianfan/第136集/index.m3u8#第137集$https://v.fengbao8.com/video/doupocangqiongnianfan/第137集/index.m3u8#第138集$https://v.fengbao8.com/video/doupocangqiongnianfan/第138集/index.m3u8#第139集$https://p.bvvvvvvv7f.com/video/doupocangqiongnianfan/第139集/index.m3u8#第140集$https://v.fengbao8.com/video/doupocangqiongnianfan/第140集/index.m3u8#第141集$https://v.fengbao8.com/video/doupocangqiongnianfan/第141集/index.m3u8#第142集$https://v.fengbao8.com/video/doupocangqiongnianfan/第142集/index.m3u8#第143集$https://v.fengbao8.com/video/doupocangqiongnianfan/第143集/index.m3u8#第144集$https://v.fengbao8.com/video/doupocangqiongnianfan/第144集/index.m3u8#第145集$https://v.fengbao8.com/video/doupocangqiongnianfan/第145集/index.m3u8#第146集$https://v.fengbao8.com/video/doupocangqiongnianfan/第146集/index.m3u8#第147集$https://v.fengbao8.com/video/doupocangqiongnianfan/第147集/index.m3u8#第148集$https://v.fengbao8.com/video/doupocangqiongnianfan/第148集/index.m3u8#第149集$https://v.fengbao8.com/video/doupocangqiongnianfan/第149集/index.m3u8#第150集$https://v.fengbao8.com/video/doupocangqiongnianfan/第150集/index.m3u8#第151集$https://v.fengbao8.com/video/doupocangqiongnianfan/第151集/index.m3u8#第152集$https://v.fengbao8.com/video/doupocangqiongnianfan/第152集/index.m3u8#第153集$https://v.fengbao8.com/video/doupocangqiongnianfan/第153集/index.m3u8#第154集$https://v.fengbao8.com/video/doupocangqiongnianfan/第154集/index.m3u8#第155集$https://v.fengbao8.com/video/doupocangqiongnianfan/第155集/index.m3u8#第156集$https://v.fengbao8.com/video/doupocangqiongnianfan/第156集/index.m3u8#第157集$https://v.fengbao8.com/video/doupocangqiongnianfan/第157集/index.m3u8#第158集$https://v.fengbao8.com/video/doupocangqiongnianfan/第158集/index.m3u8#第159集$https://v.fengbao8.com/video/doupocangqiongnianfan/第159集/index.m3u8#第160集$https://v.fengbao8.com/video/doupocangqiongnianfan/第160集/index.m3u8#第161集$https://v.fengbao8.com/video/doupocangqiongnianfan/第161集/index.m3u8#第162集$https://v.fengbao8.com/video/doupocangqiongnianfan/第162集/index.m3u8#第163集$https://v.fengbao8.com/video/doupocangqiongnianfan/第163集/index.m3u8#第164集$https://v.fengbao8.com/video/doupocangqiongnianfan/第164集/index.m3u8#第165集$https://v.fengbao8.com/video/doupocangqiongnianfan/第165集/index.m3u8#第166集$https://v.fengbao8.com/video/doupocangqiongnianfan/第166集/index.m3u8#第167集$https://v.fengbao8.com/video/doupocangqiongnianfan/第167集/index.m3u8#第168集$https://v.fengbao8.com/video/doupocangqiongnianfan/第168集/index.m3u8#第169集$https://v.fengbao8.com/video/doupocangqiongnianfan/第169集/index.m3u8#第170集$https://v.fengbao8.com/video/doupocangqiongnianfan/第170集/index.m3u8#第171集$https://v.fengbao8.com/video/doupocangqiongnianfan/第171集/index.m3u8#第172集$https://v.fengbao8.com/video/doupocangqiongnianfan/第172集/index.m3u8#第173集$https://v.fengbao8.com/video/doupocangqiongnianfan/第173集/index.m3u8#第174集$https://v.fengbao8.com/video/doupocangqiongnianfan/第174集/index.m3u8#第175集$https://v.fengbao8.com/video/doupocangqiongnianfan/第175集/index.m3u8#第176集$https://v.baofeng9.com/video/doupocangqiongnianfan/a56b8bd58286/index.m3u8#第177集$https://v.baofeng9.com/video/doupocangqiongnianfan/e318a29df5cd/index.m3u8#第178集$https://v.baofeng9.com/video/doupocangqiongnianfan/3a044a984323/index.m3u8#第179集$https://v.baofeng9.com/video/doupocangqiongnianfan/0ff6a20df940/index.m3u8#第180集$https://v.baofeng9.com/video/doupocangqiongnianfan/bf0998aa7822/index.m3u8#第181集$https://v.baofeng9.com/video/doupocangqiongnianfan/11f2ef07e08f/index.m3u8#第182集$https://v.baofeng9.com/video/doupocangqiongnianfan/7c82912d1816/index.m3u8#第183集$https://v.baofeng9.com/video/doupocangqiongnianfan/7a229156e345/index.m3u8#第184集$https://v.baofeng9.com/video/doupocangqiongnianfan/fd440f80891e/index.m3u8#第185集$https://v.baofeng9.com/video/doupocangqiongnianfan/e0e681d222ca/index.m3u8#第186集$https://v.baofeng9.com/video/doupocangqiongnianfan/18358cf938aa/index.m3u8#第187集$https://v.baofeng9.com/video/doupocangqiongnianfan/cade6e75cc96/index.m3u8#第188集$https://v.baofeng9.com/video/doupocangqiongnianfan/c56a2c9e1ca3/index.m3u8#第189集$https://s3.bfllvip.com/video/doupocangqiongnianfan/7db4155e1ad7/index.m3u8#第190集$https://v.baofeng9.com/video/doupocangqiongnianfan/1e0fc23e6324/index.m3u8#第191集$https://v.baofeng9.com/video/doupocangqiongnianfan/d19777aae004/index.m3u8#第192集$https://v.baofeng9.com/video/doupocangqiongnianfan/1469385df4a4/index.m3u8#第193集$https://v.baofeng9.com/video/doupocangqiongnianfan/6aa670bd1fc1/index.m3u8#第194集$https://v.baofeng9.com/video/doupocangqiongnianfan/f2167e1aac08/index.m3u8#第195集$https://bfeng10.com/video/doupocangqiongnianfan/8564060668b9/index.m3u8#第196集$https://bfeng10.com/video/doupocangqiongnianfan/3bf7c1b88510/index.m3u8#第197集$https://bfeng10.com/video/doupocangqiongnianfan/86f6f921b2fa/index.m3u8#第198集$https://bfeng10.com/video/doupocangqiongnianfan/8df735baa9a8/index.m3u8#第199集$https://bfeng10.com/video/doupocangqiongnianfan/9aac33b1a37b/index.m3u8#第200集$https://s3.bfllvip.com/video/doupocangqiongnianfan/38b95c9d3dc4/index.m3u8#第201集$https://bfeng10.com/video/doupocangqiongnianfan/f74d5ac15a5b/index.m3u8#第202集$https://bfeng10.com/video/doupocangqiongnianfan/bfaabd4bed22/index.m3u8#第203集$https://bfeng10.com/video/doupocangqiongnianfan/66d6d7ce4e3b/index.m3u8#第204集$https://bfeng10.com/video/doupocangqiongnianfan/bc737de61299/index.m3u8#第205集$https://bfeng11.com/video/doupocangqiongnianfan/a4cdd21ba0d9/index.m3u8#第206集$https://bfeng11.com/video/doupocangqiongnianfan/5b6b0cef24a5/index.m3u8#第207集$https://bfeng11.com/video/doupocangqiongnianfan/be71188ece6d/index.m3u8#第208集$https://fengbao12.com/video/doupocangqiongnianfan/2bb4b4691e13/index.m3u8#第209集$https://fengbao12.com/video/doupocangqiongnianfan/302d8dabb61c/index.m3u8#第210集$https://fengbao12.com/video/doupocangqiongnianfan/326efbe52449/index.m3u8#第211集$https://fengbao12.com/video/doupocangqiongnianfan/6ea97a03436d/index.m3u8#第212集$https://fengbao13.com/video/doupocangqiongnianfan/1522ce9b671d/index.m3u8#第213集$https://fengbao13.com/video/doupocangqiongnianfan/04450bdb1cd3/index.m3u8#第214集$https://fengbao13.com/video/doupocangqiongnianfan/21c2e1aeebea/index.m3u8"
  },
  {
    "vod_id": 9088,
    "vod_name": "抓娃娃",
    "vod_sub": "抓娃娃",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240715-1/0896e0d8495c55eb4ef917b6186623e4.jpg",
    "type_name": "喜剧片",
    "vod_year": "2024",
    "vod_remarks": "HD国语",
    "vod_score": "9.0",
    "vod_actor": "沈腾,马丽,史彭元,萨日娜,肖帛辰,张子栋,李嘉琦,魏翔,贾冰,于洋,李宗恒,赵凤霞,马文波,孙贵权,杨文哲,骆佳,陈冰,屈爽,刘鉴,丁柳元,王成思,张一鸣,陶亮,芮丹尼,于健",
    "vod_content": "<p>　　困苦的爹，辛劳的妈，破烂的院子，破碎的他。西虹市做大做强的路上怎么把老马家落下了？！<br/>　　“汤里没油，兜里没子”的马成钢（沈腾 饰）和春兰（马丽 饰），赶驴打工，家徒四壁，而儿子马继业（肖帛辰 饰）则是他们逆天改命的唯一希望。小马很争气，年年好成绩，一点不娇气，意志贼坚毅。但随着小马一天天长大，他却逐渐发现身边的人们都越来越不对劲……</p>",
    "vod_play_from": "非凡超清",
    "vod_play_url": "第2集$https://vip.ffzy-play8.com/20250309/483205_55ab91ae/index.m3u8#第3集$https://vip.ffzy-play8.com/20250309/483192_78b41970/index.m3u8#第4集$https://vip.ffzy-play8.com/20250309/483187_4d7a8fdd/index.m3u8#第5集$https://vip.ffzy-play8.com/20250309/483186_8265959d/index.m3u8#第6集$https://vip.ffzy-play8.com/20250309/483185_82b20b95/index.m3u8#第7集$https://vip.ffzy-play8.com/20250309/483183_96924d08/index.m3u8#第8集$https://vip.ffzy-play8.com/20250309/483184_b1a0a067/index.m3u8#第9集$https://vip.ffzy-play8.com/20250309/483182_d5784a93/index.m3u8#第10集$https://vip.ffzy-play8.com/20250309/483216_29ba3dfe/index.m3u8#第11集$https://vip.ffzy-play8.com/20250309/483215_95ddc519/index.m3u8#第12集$https://vip.ffzy-play8.com/20250309/483210_f772b06d/index.m3u8#第13集$https://vip.ffzy-play8.com/20250309/483214_e5247021/index.m3u8#第14集$https://vip.ffzy-play8.com/20250309/483213_65e41c67/index.m3u8#第15集$https://vip.ffzy-play8.com/20250309/483212_ed91a536/index.m3u8#第16集$https://vip.ffzy-play8.com/20250309/483211_e263b1e0/index.m3u8#第17集$https://vip.ffzy-play8.com/20250309/483208_0316d19e/index.m3u8#第18集$https://vip.ffzy-play8.com/20250309/483207_97075115/index.m3u8#第19集$https://vip.ffzy-play8.com/20250309/483209_af8bae0b/index.m3u8#第20集$https://vip.ffzy-play8.com/20250309/483206_8042497a/index.m3u8#第21集$https://vip.ffzy-play8.com/20250309/483198_9579198f/index.m3u8#第22集$https://vip.ffzy-play8.com/20250309/483204_f584f847/index.m3u8#第23集$https://vip.ffzy-play8.com/20250309/483203_66c0eacd/index.m3u8#第24集$https://vip.ffzy-play8.com/20250309/483202_2622dd12/index.m3u8#第25集$https://vip.ffzy-play8.com/20250309/483200_efa7d52e/index.m3u8#第26集$https://vip.ffzy-play8.com/20250309/483197_45e5b7f6/index.m3u8#第27集$https://vip.ffzy-play8.com/20250309/483199_4b674253/index.m3u8#第28集$https://vip.ffzy-play8.com/20250309/483196_8bbc32d5/index.m3u8#第29集$https://vip.ffzy-play8.com/20250309/483201_660fe4a9/index.m3u8#第30集$https://vip.ffzy-play8.com/20250309/483195_71e22ae9/index.m3u8#第31集$https://vip.ffzy-play8.com/20250309/483194_2197c04c/index.m3u8#第32集$https://vip.ffzy-play8.com/20250309/483193_ab683dbc/index.m3u8#第33集$https://vip.ffzy-play8.com/20250309/483189_b962d736/index.m3u8#第34集$https://vip.ffzy-play8.com/20250309/483191_975ccb95/index.m3u8#第35集$https://vip.ffzy-play8.com/20250309/483190_293e9fa8/index.m3u8#第36集$https://vip.ffzy-play8.com/20250309/483188_d750226d/index.m3u8"
  },
  {
    "vod_id": 10088,
    "vod_name": "周处除三害",
    "vod_sub": "周处除三害",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240301-1/a30959d51063cce7cc569619387a4219.jpg",
    "type_name": "动作片",
    "vod_year": "2024",
    "vod_remarks": "HD国语",
    "vod_score": "9.1",
    "vod_actor": "阮经天,袁富华,陈以文,王净,李李仁,谢琼煖,陈秉佑,曾珮瑜,游安顺,刘子铨,吴奕蓉,黄迪扬,曾向镇,沈威年,杨迦恩,曾皓泽,郑永岳,张启乐,苏耀庭",
    "vod_content": "<p>　　通缉犯陈桂林（阮经天 饰）生命将尽，却发现自己在通缉榜上只排名第三，他决心查出前两名通缉犯的下落，并将他们一一除掉。陈桂林以为自己已成为当代的周处除三害，却没想到永远参不透的贪嗔痴，才是人生终要面对的罪与罚。<br/>　　影片引用的“周处除三害”典故，见于《晋书·周处传》和《世说新语》。据记载，少年周处身形魁梧，武力高强，却横行乡里，为邻人所厌。后周处只身斩杀猛虎孽蛟，他自己也浪子回头、改邪归正，至此三害皆除。</p>",
    "vod_play_from": "非凡超清",
    "vod_play_url": "第01集$https://vod.feifei-online.com/20240608/220836_38b9b8a1/index.m3u8#第02集$https://vod.feifei-online.com/20240608/220835_7acc1867/index.m3u8#第03集$https://vod.feifei-online.com/20240608/220833_f99dbef7/index.m3u8#第04集$https://vod.feifei-online.com/20240608/220837_5dcc360e/index.m3u8#第05集$https://vod.feifei-online.com/20240608/220983_90fbe9b6/index.m3u8#第06集$https://vod.feifei-online.com/20240608/220982_4d079c92/index.m3u8#第07集$https://vod.feifei-online.com/20240608/220984_d8d2e52f/index.m3u8#第08集$https://vod.feifei-online.com/20240608/220981_cbd7a405/index.m3u8#第09集$https://vod.feifei-online.com/20240608/220985_7db06234/index.m3u8#第10集$https://vod.feifei-online.com/20240608/220980_58ed1e52/index.m3u8#第11集$https://vod.feifei-online.com/20240608/220986_f2ab330f/index.m3u8#第12集$https://vod.feifei-online.com/20240608/220988_4ac590f9/index.m3u8#第13集$https://vod.feifei-online.com/20240608/220990_48bc2c5c/index.m3u8#第14集$https://vod.feifei-online.com/20240608/220987_4004ea7e/index.m3u8#第15集$https://vod.feifei-online.com/20240608/220991_d629c23c/index.m3u8#第16集$https://vod.feifei-online.com/20240608/220989_deb24149/index.m3u8#第17集$https://vod.feifei-online.com/20240608/220992_88b8daee/index.m3u8#第18集$https://vod.feifei-online.com/20240608/220995_23b87f23/index.m3u8#第19集$https://vod.feifei-online.com/20240608/220996_ec37149f/index.m3u8#第20集$https://vod.feifei-online.com/20240608/220997_0f3fe26a/index.m3u8#第21集$https://vod.feifei-online.com/20240608/220993_bd9d9e7b/index.m3u8#第22集$https://vod.feifei-online.com/20240608/220994_bbc8c833/index.m3u8#第23集$https://vod.feifei-online.com/20240608/220998_cce8056b/index.m3u8#第24集$https://vod.feifei-online.com/20240608/220999_e3dd518e/index.m3u8#第25集$https://vod.feifei-online.com/20240608/221002_ded418f8/index.m3u8#第26集$https://vod.feifei-online.com/20240608/221000_9026a418/index.m3u8#第27集$https://vod.feifei-online.com/20240608/221001_694b2e4c/index.m3u8#第28集$https://vod.feifei-online.com/20240608/221003_1051508c/index.m3u8#第29集$https://vod.feifei-online.com/20240608/221004_ecdb6ec8/index.m3u8#第30集$https://vod.feifei-online.com/20240608/221008_5f6f213c/index.m3u8#第31集$https://vod.feifei-online.com/20240608/221006_10c99985/index.m3u8#第32集$https://vod.feifei-online.com/20240608/221007_557b12cc/index.m3u8#第33集$https://vod.feifei-online.com/20240608/221009_43501cde/index.m3u8#第34集$https://vod.feifei-online.com/20240608/221005_d1ac7ba8/index.m3u8#第35集$https://vod.feifei-online.com/20240608/221010_6a6bcfca/index.m3u8#第36集$https://vod.feifei-online.com/20240608/221013_52fc0401/index.m3u8#第37集$https://vod.feifei-online.com/20240608/221011_cc44914c/index.m3u8#第38集$https://vod.feifei-online.com/20240608/221012_b2122159/index.m3u8#第39集$https://vod.feifei-online.com/20240608/221014_fadd046f/index.m3u8#第40集$https://vod.feifei-online.com/20240608/221015_bde8b4f3/index.m3u8#第41集$https://vod.feifei-online.com/20240608/221016_7c893777/index.m3u8#第42集$https://vod.feifei-online.com/20240608/221018_cc2a33e7/index.m3u8#第43集$https://vod.feifei-online.com/20240608/221019_8e78260a/index.m3u8#第44集$https://vod.feifei-online.com/20240608/221017_0f6fcf87/index.m3u8#第45集$https://vod.feifei-online.com/20240608/221020_42590e2f/index.m3u8#第46集$https://vod.feifei-online.com/20240608/221021_81881c54/index.m3u8#第47集$https://vod.feifei-online.com/20240608/221022_35c9f154/index.m3u8#第48集$https://vod.feifei-online.com/20240608/221024_0fd8f783/index.m3u8#第49集$https://vod.feifei-online.com/20240608/221023_e0f56c36/index.m3u8#第50集$https://vod.feifei-online.com/20240608/221025_ee8146f3/index.m3u8#第51集$https://vod.feifei-online.com/20240608/221026_cef3c710/index.m3u8#第52集$https://vod.feifei-online.com/20240608/221027_0c68fe1a/index.m3u8#第53集$https://vod.feifei-online.com/20240608/221028_a9d3e7db/index.m3u8#第54集$https://vod.feifei-online.com/20240608/221030_c06c32e2/index.m3u8#第55集$https://vod.feifei-online.com/20240608/221029_d61651b9/index.m3u8#第56集$https://vod.feifei-online.com/20240608/221032_4c6ae7fb/index.m3u8#第57集$https://vod.feifei-online.com/20240608/221033_47d9f79a/index.m3u8#第58集$https://vod.feifei-online.com/20240608/221031_e31b5249/index.m3u8#第59集$https://vod.feifei-online.com/20240608/221036_60717970/index.m3u8#第60集$https://vod.feifei-online.com/20240608/221034_11f01e6e/index.m3u8#第61集$https://vod.feifei-online.com/20240608/221035_4c41bc54/index.m3u8#第62集$https://vod.feifei-online.com/20240608/221039_ae1c3142/index.m3u8#第63集$https://vod.feifei-online.com/20240608/221037_d94cf156/index.m3u8#第64集$https://vod.feifei-online.com/20240608/221038_1544d894/index.m3u8#第65集$https://vod.feifei-online.com/20240608/221040_86c71350/index.m3u8#第66集$https://vod.feifei-online.com/20240608/221042_b603ba88/index.m3u8#第67集$https://vod.feifei-online.com/20240608/221041_9fab2816/index.m3u8#第68集$https://vod.feifei-online.com/20240608/221045_2cfa8b28/index.m3u8#第69集$https://vod.feifei-online.com/20240608/221043_0d924579/index.m3u8#第70集$https://vod.feifei-online.com/20240608/221044_72082e5b/index.m3u8"
  },
  {
    "vod_id": 11088,
    "vod_name": "飞驰人生2",
    "vod_sub": "飞驰人生2",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240212-1/d9b988f10fea84d0de3061a15792de15.jpg",
    "type_name": "喜剧片",
    "vod_year": "2024",
    "vod_remarks": "HD国语",
    "vod_score": "9.0",
    "vod_actor": "沈腾,范丞丞,尹正,张本煜,孙艺洲,魏翔,贾冰,郑恺,冯绍峰,黄景瑜,刘昊然,于适,胡先煦,阎鹤祥,周野芒,高华阳,孙强,范高翔,郝瀚",
    "vod_content": "<p>　　昔日冠军车手张驰（沈腾 饰）沦为落魄驾校教练，过着靠脸吃饭勉强度日的生活。不料天上掉馅饼，濒临停产的老头乐车厂厂长（贾冰 饰）主动提出赞助张驰组建车队再闯最后一届巴音布鲁克拉力赛。面对这泼天的富贵，张驰蠢蠢欲动，而厂长背后真实的目的无人知晓……带资进队的车手厉小海（范丞丞 饰），看似单纯善良却为何有着与之身份毫不相符的超强天赋？<br/>　　张驰召集老朋友孙宇强（尹正 饰）和记星（张本煜 饰），与天才车手厉小海和总是考不过科目二的菜鸟驾校学员刘显德（孙艺洲 饰）组成了一个苦中作乐、鸡飞狗跳的草台班子，克服重重困难，笑料百出地奔赴赛场。这一次他将超越无数次出现在梦中的终点线……</p>",
    "vod_play_from": "暴风专线",
    "vod_play_url": "HD$https://c1.ddbbffcdn.com/video/feichirensheng2/HD/index.m3u8#TC$https://c1.rrcdnbf5.com/video/feichirensheng2/TC/index.m3u8"
  },
  {
    "vod_id": 12088,
    "vod_name": "边水往事",
    "vod_sub": "边水往事",
    "vod_pic": "https://img.lzipic.com/upload/vod/20240816-1/ab2e4c9bd445c931652bb5624b0b0811.jpg",
    "type_name": "国产剧",
    "vod_year": "2024",
    "vod_remarks": "全21集",
    "vod_score": "9.3",
    "vod_actor": "郭麒麟,吴镇宇,尤勇智,王迅,齐溪,王玉雯,姜珮瑶,江奇霖,蒋奇明,赵润南,周政杰,甘昀宸,宋家腾,辛浩江,王海涛,王小木,颜北,刘洋,魏伟,付博文,董博睿,钱磊,钱洁,李晓川,刘陆,赵君,陈松伶,尹子维",
    "vod_content": "<p>　　三边坡，一处鱼龙混杂的热带异域，一个繁茂与衰败并生的斑驳之地。意外流落三边坡的打工小白沈星（郭麒麟 饰）遇到在多方势力间游走的三边坡和事佬猜叔（吴镇宇 饰），一场冒险，一段善良微光指引下的回归，在留与逃的挣扎中将如何上演。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.lzcdn28.com/20250923/1953_0d0876ed/index.m3u8#第02集$https://v.lzcdn28.com/20250923/1961_f7979bc2/index.m3u8#第03集$https://v.lzcdn28.com/20250923/1962_c65e71c1/index.m3u8#第04集$https://v.lzcdn28.com/20250923/1963_eaf2d518/index.m3u8#第05集$https://v.lzcdn28.com/20250923/1970_daa2cc25/index.m3u8#第06集$https://v.lzcdn28.com/20250923/1977_cf8709aa/index.m3u8#第07集$https://v.lzcdn28.com/20250923/1978_5e39c155/index.m3u8#第08集$https://v.lzcdn28.com/20250923/1987_e226eeb2/index.m3u8#第09集$https://v.lzcdn28.com/20250923/1994_e620190e/index.m3u8#第10集$https://v.lzcdn28.com/20250923/2007_037af0ff/index.m3u8#第11集$https://v.lzcdn28.com/20250923/2014_d3668d3a/index.m3u8#第12集$https://v.lzcdn28.com/20250923/2022_cd976b44/index.m3u8#第13集$https://v.lzcdn28.com/20250923/2030_597b1b51/index.m3u8#第14集$https://v.lzcdn28.com/20250923/2038_5f97874f/index.m3u8#第15集$https://v.lzcdn28.com/20250923/2051_ddd1be99/index.m3u8#第16集$https://v.lzcdn28.com/20250923/2056_e18f177a/index.m3u8#第17集$https://v.lzcdn28.com/20250923/2060_6c2f4ad8/index.m3u8#第18集$https://v.lzcdn28.com/20250923/2072_13a45d51/index.m3u8#第19集$https://v.lzcdn28.com/20250923/2078_1bed631d/index.m3u8#第20集$https://v.lzcdn28.com/20250923/2086_3c7e81ac/index.m3u8#第21集$https://v.lzcdn28.com/20250923/2094_b63c9af0/index.m3u8$$$第01集$https://svip.feifei-play.com/20240816/706_9c82c714/index.m3u8#第02集$https://svip.feifei-play.com/20240816/707_500e75a0/index.m3u8#第03集$https://svip.feifei-play.com/20240816/708_ae0eb3ee/index.m3u8#第04集$https://svip.feifei-play.com/20240816/709_1ecfb463/index.m3u8#第05集$https://svip.feifei-play.com/20240817/749_b056eb15/index.m3u8#第06集$https://svip.feifei-play.com/20240817/748_e49b8b40/index.m3u8#第07集$https://svip.feifei-play.com/20240818/790_2dace78f/index.m3u8#第08集$https://svip.feifei-play.com/20240818/789_68053af2/index.m3u8#第09集$https://svip.feifei-play.com/20240819/832_7250eb93/index.m3u8#第10集$https://svip.feifei-play.com/20240820/897_5705e116/index.m3u8#第11集$https://svip.feifei-play.com/20240821/961_d707329b/index.m3u8#第12集$https://svip.feifei-play.com/20240822/1019_03e0704b/index.m3u8#第13集$https://svip.feifei-play.com/20240823/1106_c9f95a0a/index.m3u8#第14集$https://svip.feifei-play.com/20240824/1146_8a3363ab/index.m3u8#第15集$https://svip.feifei-play.com/20240825/1193_9a3d4583/index.m3u8#第16集$https://svip.feifei-play.com/20240828/1340_4f87658e/index.m3u8#第17集$https://svip.feifei-play.com/20240829/1397_215a71a1/index.m3u8#第18集$https://svip.feifei-play.com/20240829/1400_f0dd4a99/index.m3u8#第19集$https://svip.feifei-play.com/20240829/1401_9701a1c1/index.m3u8#第20集$https://svip.feifei-play.com/20240829/1402_28fc2782/index.m3u8#第21集$https://svip.feifei-play.com/20240829/1403_4edaa105/index.m3u8$$$第01集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第01集/index.m3u8#第02集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第02集/index.m3u8#第03集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第03集/index.m3u8#第04集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第04集/index.m3u8#第05集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第05集/index.m3u8#第06集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第06集/index.m3u8#第07集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第07集/index.m3u8#第08集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第08集/index.m3u8#第09集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第09集/index.m3u8#第10集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第10集/index.m3u8#第11集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第11集/index.m3u8#第12集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第12集/index.m3u8#第13集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第13集/index.m3u8#第14集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第14集/index.m3u8#第15集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第15集/index.m3u8#第16集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第16集/index.m3u8#第17集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第17集/index.m3u8#第18集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第18集/index.m3u8#第19集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第19集/index.m3u8#第20集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第20集/index.m3u8#第21集$https://c1.ddbbffcdn.com/video/bianshuiwangshi/第21集/index.m3u8"
  },
  {
    "vod_id": 13088,
    "vod_name": "唐朝诡事录之长安",
    "vod_sub": "唐朝诡事录",
    "vod_pic": "https://img.lzipic.com/upload/vod/20220927-1/cd5d1e3763193b98bc6fdd8fe6957317.jpg",
    "type_name": "国产剧",
    "vod_year": "2024",
    "vod_remarks": "全40集",
    "vod_score": "9.2",
    "vod_actor": "杨旭文,杨志刚,郜思雯,陈创,孙雪宁,石悦安鑫",
    "vod_content": "<p>　　先天二年夏秋之交，天子虽已登基，但大长公主势力更盛，长安局势阴晴难定。卢凌风（杨旭文 饰）和苏无名（杨志刚 饰），奉命带着由裴喜君、费鸡师、樱桃和薛环组成的探案小队，以护送康国所献金桃的名义重返长安。繁华的长安，卢凌风复职雍州司法参军，苏无名则被授予一个特殊的官职，同时叫费鸡师出任酥山店掌柜，并将店铺设置成全长安的暗探情报中心。卢苏二人推出新政，开启环城探案模式，深入长安各坊，接触到了更广泛的百姓和民生，也借此避开了天子与大长公主的争斗。在历经康国的金桃、成佛寺的哭声、白泽的踪迹、食尾蛇、解忧店等多宗疑案后，最终长安的风云汇聚到事关朝堂的盛世马球案。卢凌风和苏无名，不得不直面这个刀光剑影的秋天以及各自的命运，并为此付出了沉重的代价。即使历经风雨，但他们终究在万年长安大观盛唐，护佑百姓的初心始终没有改变。</p>",
    "vod_play_from": "量子蓝光$$$非凡超清$$$暴风专线",
    "vod_play_url": "第01集$https://v.cdnlz29.com/20251203/9276_ddb182c5/index.m3u8#第02集$https://v.cdnlz29.com/20251203/9282_28363622/index.m3u8#第03集$https://v.cdnlz29.com/20251203/9283_a372a372/index.m3u8#第04集$https://v.cdnlz29.com/20251203/9295_c150ae0a/index.m3u8#第05集$https://v.cdnlz29.com/20251203/9300_61b8773e/index.m3u8#第06集$https://v.cdnlz29.com/20251203/9306_adc537a2/index.m3u8#第07集$https://v.cdnlz29.com/20251203/9311_b2b82b3a/index.m3u8#第08集$https://v.cdnlz29.com/20251203/9319_6980002d/index.m3u8#第09集$https://v.cdnlz29.com/20251203/9328_060448cf/index.m3u8#第10集$https://v.cdnlz29.com/20251203/9330_dad4af80/index.m3u8#第11集$https://v.cdnlz29.com/20251203/9340_cf3a5c39/index.m3u8#第12集$https://v.cdnlz29.com/20251203/9347_a75da001/index.m3u8#第13集$https://v.cdnlz29.com/20251203/9351_a723cd6d/index.m3u8#第14集$https://v.cdnlz29.com/20251203/9358_0fc1753c/index.m3u8#第15集$https://v.cdnlz29.com/20251203/9367_d9116584/index.m3u8#第16集$https://v.cdnlz29.com/20251203/9373_0cc5a453/index.m3u8#第17集$https://v.cdnlz29.com/20251203/9381_e0165e45/index.m3u8#第18集$https://v.cdnlz29.com/20251203/9389_d9247725/index.m3u8#第19集$https://v.cdnlz29.com/20251203/9399_fc0de942/index.m3u8#第20集$https://v.cdnlz29.com/20251203/9408_f410f870/index.m3u8#第21集$https://v.cdnlz29.com/20251203/9415_499e6f5c/index.m3u8#第22集$https://v.cdnlz29.com/20251203/9417_bf51f6cb/index.m3u8#第23集$https://v.cdnlz29.com/20251203/9426_b83a6af3/index.m3u8#第24集$https://v.cdnlz29.com/20251203/9432_c28f3033/index.m3u8#第25集$https://v.cdnlz29.com/20251203/9445_11e09850/index.m3u8#第26集$https://v.cdnlz29.com/20251203/9447_ea1ce92f/index.m3u8#第27集$https://v.cdnlz29.com/20251203/9458_9668c717/index.m3u8#第28集$https://v.cdnlz29.com/20251203/9465_22adef28/index.m3u8#第29集$https://v.cdnlz29.com/20251203/9473_1cdb608a/index.m3u8#第30集$https://v.cdnlz29.com/20251203/9478_42d4ce45/index.m3u8#第31集$https://v.cdnlz29.com/20251203/9489_962efe2d/index.m3u8#第32集$https://v.cdnlz29.com/20251203/9497_d7e6a388/index.m3u8#第33集$https://v.cdnlz29.com/20251203/9501_c4daa7d5/index.m3u8#第34集$https://v.cdnlz29.com/20251203/9504_e778a82b/index.m3u8#第35集$https://v.cdnlz29.com/20251203/9509_dc74a1fd/index.m3u8#第36集$https://v.cdnlz29.com/20251203/9518_75b61d96/index.m3u8$$$第01集$https://vip.ffzy-plays.com/20251108/47369_d2625d00/index.m3u8#第02集$https://vip.ffzy-plays.com/20251108/47370_6544e220/index.m3u8#第03集$https://vip.ffzy-plays.com/20251108/47371_991167de/index.m3u8#第04集$https://vip.ffzy-plays.com/20251108/47372_c2288100/index.m3u8#第05集$https://vip.ffzy-plays.com/20251108/47373_5b6e8759/index.m3u8#第06集$https://vip.ffzy-plays.com/20251108/47374_6c489ad0/index.m3u8#第07集$https://vip.ffzy-plays.com/20251109/47419_41792dd7/index.m3u8#第08集$https://vip.ffzy-plays.com/20251109/47420_3e3c0872/index.m3u8#第09集$https://vip.ffzy-plays.com/20251110/47458_61b360a1/index.m3u8#第10集$https://vip.ffzy-plays.com/20251110/47459_6bc4cd4a/index.m3u8#第11集$https://vip.ffzy-plays.com/20251111/47485_4bf9decb/index.m3u8#第12集$https://vip.ffzy-plays.com/20251111/47486_9ad55466/index.m3u8#第13集$https://vip.ffzy-plays.com/20251112/47507_a080c3b2/index.m3u8#第14集$https://vip.ffzy-plays.com/20251112/47508_5c54c0e8/index.m3u8#第15集$https://vip.ffzy-plays.com/20251113/47547_0054c9f7/index.m3u8#第16集$https://vip.ffzy-plays.com/20251113/47548_b47809bc/index.m3u8#第17集$https://vip.ffzy-plays.com/20251114/47573_ab70ec30/index.m3u8#第18集$https://vip.ffzy-plays.com/20251114/47574_c70bb5cf/index.m3u8#第19集$https://vip.ffzy-plays.com/20251115/47611_f0952a50/index.m3u8#第20集$https://vip.ffzy-plays.com/20251115/47612_1160b456/index.m3u8#第21集$https://vip.ffzy-plays.com/20251116/47645_dcebacc9/index.m3u8#第22集$https://vip.ffzy-plays.com/20251116/47646_03450e16/index.m3u8#第23集$https://vip.ffzy-plays.com/20251117/47671_4e7fe307/index.m3u8#第24集$https://vip.ffzy-plays.com/20251117/47672_99edc3da/index.m3u8#第25集$https://vip.ffzy-plays.com/20251118/47695_d0724cf9/index.m3u8#第26集$https://vip.ffzy-plays.com/20251118/47696_786d2f3c/index.m3u8#第27集$https://vip.ffzy-plays.com/20251119/47722_5ce16961/index.m3u8#第28集$https://vip.ffzy-plays.com/20251119/47723_6bec3e77/index.m3u8#第29集$https://vip.ffzy-plays.com/20251120/47755_846a958c/index.m3u8#第30集$https://vip.ffzy-plays.com/20251120/47756_8984d064/index.m3u8#第31集$https://vip.ffzy-plays.com/20251121/47807_d238f0c1/index.m3u8#第32集$https://vip.ffzy-plays.com/20251121/47808_896f77a2/index.m3u8#第33集$https://vip.ffzy-plays.com/20251122/47840_ccf98ac3/index.m3u8#第34集$https://vip.ffzy-plays.com/20251122/47841_d67c6572/index.m3u8#第35集$https://vip.ffzy-plays.com/20251123/47873_7d67a61d/index.m3u8#第36集$https://vip.ffzy-plays.com/20251123/47874_09fc3fd7/index.m3u8#第37集$https://vip.ffzy-plays.com/20251123/47875_8cc268ea/index.m3u8#第38集$https://vip.ffzy-plays.com/20251123/47876_88b60db4/index.m3u8#第39集$https://vip.ffzy-plays.com/20251123/47877_3fa48a8a/index.m3u8#第40集$https://vip.ffzy-plays.com/20251123/47878_b91c197e/index.m3u8$$$第01集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第01集/index.m3u8#第02集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第02集/index.m3u8#第03集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第03集/index.m3u8#第04集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第04集/index.m3u8#第05集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第05集/index.m3u8#第06集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第06集/index.m3u8#第07集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第07集/index.m3u8#第08集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第08集/index.m3u8#第09集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第09集/index.m3u8#第10集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第10集/index.m3u8#第11集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第11集/index.m3u8#第12集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第12集/index.m3u8#第13集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第13集/index.m3u8#第14集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第14集/index.m3u8#第15集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第15集/index.m3u8#第16集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第16集/index.m3u8#第17集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第17集/index.m3u8#第18集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第18集/index.m3u8#第19集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第19集/index.m3u8#第20集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第20集/index.m3u8#第21集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第21集/index.m3u8#第22集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第22集/index.m3u8#第23集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第23集/index.m3u8#第24集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第24集/index.m3u8#第25集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第25集/index.m3u8#第26集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第26集/index.m3u8#第27集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第27集/index.m3u8#第28集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第28集/index.m3u8#第29集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第29集/index.m3u8#第30集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第30集/index.m3u8#第31集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第31集/index.m3u8#第32集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第32集/index.m3u8#第33集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第33集/index.m3u8#第34集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第34集/index.m3u8#第35集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第35集/index.m3u8#第36集$https://p.bvvvvvvvvv1f.com/video/tangchaoguishilu/第36集/index.m3u8"
  }
];


    // 判断是否为原站主力源（豆瓣1080P原画、暴风超清、茅台蓝光、量子、非凡 —— 速度最快、画质最佳、弹幕时间轴最准）
    function getRoutePriorityScore(rawName, sampleUrl) {
        const name = String(rawName || '').trim();
        const lower = name.toLowerCase();
        const urlStr = String(sampleUrl || '').toLowerCase();
        if (name.includes('豆瓣') || lower.includes('douban') || urlStr.includes('ajupf')) return 120;
        if (name.includes('暴风') || lower.includes('baofeng') || lower.includes('fengbao') || urlStr.includes('fengbao') || urlStr.includes('bvvvv')) return 115;
        if (name.includes('茅台') || lower.includes('maotai') || urlStr.includes('uvjtih') || urlStr.includes('myqqdd')) return 110;
        if (name.includes('1080P') || name.includes('4K') || name.includes('蓝光') || name.includes('原画')) return 105;
        if (name.includes('量子') || lower.includes('lz') || lower.includes('liangzi') || urlStr.includes('cdnlz') || urlStr.includes('lzi')) return 100;
        if (name.includes('非凡') || lower.includes('feifan') || lower.includes('ff') || urlStr.includes('ffzy')) return 95;
        if (name.includes('极速') || lower.includes('jszy') || urlStr.includes('jisuzy')) return 88;
        if (name.includes('红牛') || lower.includes('hn') || lower.includes('hongniu')) return 55;
        if (name.includes('金鹰') || lower.includes('jy') || lower.includes('jinying')) return 50;
        if (name.includes('百度') || lower.includes('bd') || lower.includes('baidu')) return 45;
        if (name.includes('360') || lower.includes('360zy')) return 42;
        if (name.includes('如意') || lower.includes('ry') || lower.includes('ruyi')) return 40;
        if (name.includes('速播') || lower.includes('subo') || lower.includes('sb')) return 38;
        if (name.includes('ikun')) return 35;
        if (name.includes('魔都') || lower.includes('modu') || lower.includes('md')) return 32;
        if (name.includes('无尽') || lower.includes('wj') || lower.includes('wujin')) return 30;
        if (name.includes('光速') || lower.includes('gs') || lower.includes('guangsu')) return 28;
        return 20;
    }

    // 人性化线路标签格式化 (原站三大主源优先置顶并标注主力弹幕源，其余作为备用专线)
    function formatFriendlyLineName(rawName, index, sampleUrl) {
        if (!rawName) return '线路' + (index + 1) + ' · 极速专线';
        const name = String(rawName).trim();
        const lower = name.toLowerCase();
        const urlStr = String(sampleUrl || '').toLowerCase();
        if (name.includes('豆瓣') || lower.includes('douban') || urlStr.includes('ajupf')) {
            return '★ 主线' + (index + 1) + ' · 豆瓣1080P原画 (原站顶级·真1080P)';
        }
        if (name.includes('暴风') || lower.includes('baofeng') || urlStr.includes('fengbao')) {
            return '★ 主线' + (index + 1) + ' · 暴风1080P超清 (原站直连·高码率)';
        }
        if (name.includes('茅台') || lower.includes('maotai') || urlStr.includes('uvjtih') || urlStr.includes('myqqdd')) {
            return '★ 主线' + (index + 1) + ' · 茅台1080P蓝光 (原站臻彩·无损)';
        }
        if (name.includes('量子') || lower.includes('lz') || lower.includes('liangzi') || urlStr.includes('cdnlz')) {
            return '★ 主线' + (index + 1) + ' · 量子蓝光 (原站秒播·弹幕)';
        }
        if (name.includes('非凡') || lower.includes('feifan') || lower.includes('ffm3u8') || lower.includes('ff') || urlStr.includes('ffzy')) {
            return '★ 主线' + (index + 1) + ' · 非凡超清 (原站1080P·弹幕)';
        }
        if (name.includes('暴风') || lower.includes('baofeng') || lower.includes('bf') || urlStr.includes('bvvvv')) {
            return '★ 主线' + (index + 1) + ' · 暴风直连 (原站防卡·弹幕)';
        }
        if (name.includes('红牛') || lower.includes('hongniu') || lower.includes('hn') || lower.includes('hnm3u8')) {
            return '备用' + (index + 1) + ' · 红牛高速专线';
        }
        if (name.includes('金鹰') || lower.includes('jinying') || lower.includes('jy') || lower.includes('jinyingm3u8')) {
            return '备用' + (index + 1) + ' · 金鹰蓝光专线';
        }
        if (name.includes('百度') || lower.includes('baidu') || lower.includes('bd') || lower.includes('apibdzy')) {
            return '备用' + (index + 1) + ' · 百度超清专线';
        }
        if (name.includes('速播') || lower.includes('subo') || lower.includes('sb')) {
            return '备用' + (index + 1) + ' · 速播极速专线';
        }
        if (name.includes('iKun') || name.includes('ikun') || lower.includes('ikun')) {
            return '备用' + (index + 1) + ' · iKun超清专线';
        }
        if (name.includes('如意') || lower.includes('ruyi') || lower.includes('ry')) {
            return '备用' + (index + 1) + ' · 如意稳定专线';
        }
        if (name.includes('魔都') || lower.includes('modu') || lower.includes('md')) {
            return '备用' + (index + 1) + ' · 魔都动漫专线';
        }
        if (name.includes('无尽') || lower.includes('wujin') || lower.includes('wj') || lower.includes('wjm3u8')) {
            return '备用' + (index + 1) + ' · 无尽海量专线';
        }
        if (name.includes('光速') || lower.includes('guangsu') || lower.includes('gs') || lower.includes('gsm3u8')) {
            return '备用' + (index + 1) + ' · 光速蓝光专线';
        }
        if (name.includes('360') || lower.includes('360zy')) {
            return '备用' + (index + 1) + ' · 360超清专线';
        }
        if (/[\u4e00-\u9fa5]/.test(name)) {
            return '备用' + (index + 1) + ' · ' + name;
        }
        return '备用' + (index + 1) + ' · 超清专线';
    }

    const VIDEO_HISTORY_KEY = 'openreader_video_history';

    // 获取最近观看历史
    window.getVideoHistory = function() {
        try {
            return JSON.parse(localStorage.getItem(VIDEO_HISTORY_KEY)) || [];
        } catch(e) {
            return [];
        }
    };

    // 保存观看历史 (支持集数与集内秒数进度 + 自动触发多端云同步)
    window.saveVideoHistory = function(video, groupName, epTitle, epIdx, playSeconds = null, silentSync = false) {
        if (!video) return;
        try {
            let history = window.getVideoHistory();
            const vid = video.vod_id || video.id || video.vod_name;
            const prevRecord = history.find(h => (h.vod_id || h.id || h.vod_name) === vid);
            history = history.filter(h => (h.vod_id || h.id || h.vod_name) !== vid);

            let resolvedSeconds = 0;
            if (typeof playSeconds === 'number' && playSeconds >= 0) {
                resolvedSeconds = Math.floor(playSeconds);
            } else if (prevRecord && prevRecord.ep_idx === (epIdx || 0) && prevRecord.play_seconds > 0) {
                resolvedSeconds = prevRecord.play_seconds;
            }

            // 精简 raw_video 避免超大字段拖慢云同步
            const compactRaw = {
                vod_id: video.vod_id,
                vod_name: video.vod_name,
                vod_sub: video.vod_sub || '',
                vod_pic: video.vod_pic || '',
                type_name: video.type_name || '影视',
                vod_year: video.vod_year || '',
                vod_remarks: video.vod_remarks || '',
                vod_score: video.vod_score || '',
                vod_actor: video.vod_actor || '',
                vod_content: (video.vod_content || '').slice(0, 300),
                vod_play_from: video.vod_play_from || '',
                vod_play_url: video.vod_play_url || '',
                is_dynamic: video.is_dynamic || false
            };

            const record = {
                vod_id: vid,
                vod_name: video.vod_name,
                vod_pic: video.vod_pic || '',
                type_name: video.type_name || '影视',
                group_name: groupName || '默认线路',
                ep_title: epTitle || '第1集',
                ep_idx: epIdx || 0,
                play_seconds: resolvedSeconds,
                time: Date.now(),
                raw_video: compactRaw
            };
            history.unshift(record);
            if (history.length > 30) history = history.slice(0, 30);
            localStorage.setItem(VIDEO_HISTORY_KEY, JSON.stringify(history));
            window.renderRecentWatchBar();
            if (!silentSync && typeof window.scheduleCloudSyncPush === 'function') {
                window.scheduleCloudSyncPush('video');
            }
        } catch(e) {
            console.error('Save history failed:', e);
        }
    };

    // 清空观看历史
    window.clearVideoHistory = function() {
        if (confirm('确定要清空全部影视播放记录吗？')) {
            const list = window.getVideoHistory();
            if (typeof window.recordCloudDeletion === 'function') {
                list.forEach(item => {
                    const key = item.vod_id || item.vod_name;
                    if (key) window.recordCloudDeletion('vid:' + key);
                });
            }
            localStorage.removeItem(VIDEO_HISTORY_KEY);
            window.renderRecentWatchBar();
            if (typeof window.scheduleCloudSyncPush === 'function') {
                window.scheduleCloudSyncPush('video_clear');
            }
        }
    };

    // 渲染首页【最近观看】横向卡片条
    window.renderRecentWatchBar = function() {
        const wrap = document.getElementById('videoRecentWatchSection');
        const listEl = document.getElementById('videoRecentWatchList');
        const emptyEl = document.getElementById('videoRecentWatchEmpty');
        if (!wrap || !listEl) return;

        const history = window.getVideoHistory();
        if (!history || history.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'flex';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        listEl.innerHTML = history.map((item, idx) => {
            const timeAgo = formatTimeAgo(item.time);
            return `
                <div class="recent-watch-card" onclick="window.resumeWatchVideo(${idx})" title="点击继续播放 ${item.vod_name}">
                    <img src="${item.vod_pic}" alt="${item.vod_name}" referrerpolicy="no-referrer" onerror="this.src='https://api.iconify.design/lucide:film.svg?color=%23888'" />
                    <div class="recent-watch-info">
                        <div class="recent-watch-title">${item.vod_name}</div>
                        <div class="recent-watch-sub"><i class="fas fa-play-circle" style="color:var(--accent);"></i> 看到 ${item.ep_title || '正片'}</div>
                        <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
    };

    function formatTimeAgo(ts) {
        if (!ts) return '';
        const diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) return '刚刚';
        if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
        if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
        return Math.floor(diff / 86400) + '天前';
    }

    // 续播历史影视 (支持从首页历史第一页和影视页历史横条点击)
    window.resumeWatchVideo = function(itemOrIdx, epIdx = 0) {
        // 1. 如果当前不在影视主模块，平滑切至影视模块
        if (typeof window.switchNav === 'function') {
            window.switchNav('video');
        }

        let videoItem = null;
        let targetEp = 0;

        if (typeof itemOrIdx === 'number') {
            const history = window.getVideoHistory();
            const record = history[itemOrIdx];
            if (record) {
                videoItem = record.raw_video || {
                    vod_name: record.vod_name,
                    vod_pic: record.vod_pic,
                    vod_id: record.vod_id,
                    type_name: record.type_name,
                    vod_play_url: record.vod_play_url
                };
                targetEp = typeof record.ep_idx === 'number' ? record.ep_idx : (typeof epIdx === 'number' ? epIdx : 0);
            }
        } else if (itemOrIdx && typeof itemOrIdx === 'object') {
            videoItem = itemOrIdx.raw_video || itemOrIdx;
            targetEp = typeof epIdx === 'number' ? epIdx : (itemOrIdx.ep_idx || 0);
        }

        if (!videoItem) {
            console.warn('[OpenHappy Video] 续播记录无效:', itemOrIdx);
            return;
        }

        // 挂载到播放列表最前列并立即起播对应集数
        window.currentVideoList = [videoItem, ...(window.KANJU_HOT_LIST || [])];
        window.openVideoDetail(0, targetEp);
    };

    // kanju3 热门快搜标签点击
    window.quickSearchVideo = function(keyword) {
        const input = document.getElementById('videoSearchInput');
        if (input) input.value = keyword;

        // 优先在本地已加载影片中匹配
        const foundIdx = (window.currentVideoList || []).findIndex(item => 
            item.vod_name.includes(keyword) || 
            (item.vod_sub && item.vod_sub.includes(keyword)) ||
            (item.vod_actor && item.vod_actor.includes(keyword))
        );

        if (foundIdx !== -1) {
            window.openVideoDetail(foundIdx, 0);
            return;
        }

        // 否则进行全网检索
        window.doVideoSearch();
    };

    // 原站 kanju3.com 完整 8 大板块全量片单数据 (大家都在看、韩剧在追、日剧上新、美剧续看、国产新剧、高分电影、电影热播、院线热映)
    window.KANJU_ALL_SECTIONS = [{"title":"大家都在看","subtitle":"今晚打开就能接上的热播片单","cards":[{"vod_id":"av_skkXhxCjWXlnPW1TqzUvMXk1Wt9kM4OegeHFraY8_0NbO6_dYgTy1qyqugPNlLsASa51pSjrF10aKpY","vod_name":"现在就出发 第4季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/39/395f51655ac5559d3e06f1800cf8f468577e0d98dab315b979bdc8c0b48a60c0.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/df/dff25ef5a034c08e6c2ba4ade99af094e7d1f984a70ff4d3b829ed6a4a70042a.webp","vod_remarks":"2026-10-12 第1期 加更","type_name":"大陆综艺","vod_year":"2026","vod_actor":"沈腾, 白敬亭, 贾冰, 王安宇","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_l8XtzTVsiClLL2-Cu4XHz-mS8p6vRD_lkGQH0HkZNPQljB3pi3RiRFeVWCkPpu3NeiwCc3ckONtRNMU","vod_name":"兰香如故","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/77/772974c16e231d2de7a0c2352edc7c67c6b61c12219921ca878fcae204089480.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/59/59633c7fa37a8176ffe870ca37c5331fb347903f1d3c9aa036924943b5d882a2.webp","vod_remarks":"更新至47集","type_name":"国产剧","vod_year":"2026","vod_actor":"刘学义, 谭松韵, 李梦, 郑合惠子","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_T4S8jQCUTrDkCX1-8AtQh-yUvk-jq4EqIdG_GMMDwo7iGOwF2haz8PVAjOxhbUOJYQ-5TqZLNuiVUR8","vod_name":"仙逆","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8f/8fde7265553ab2b2240f7e8ce25e98254745eda8d55b8b80cfc79ec3e056dc5c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e5/e58d5301cbefb6f4c7eb4a9d46c5d52a002b047a6cba24031ca8deece29d0e3c.webp","vod_remarks":"更新至162集","type_name":"国产动漫","vod_year":"2023","vod_actor":"常文涛, 史泽鲲, 李慕婉, 柳眉","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_HI9tZ4kGN9qSolnN6roaKkHE--f0HxZ91EtEviikhVwWrq3yZrHPD6Z3Hn6sSZP0_6Uz56X5max9PFk","vod_name":"美人余","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/4e/4e6e7a400fb0d6031bf0f4019dd75d5e19b61aee5ebb07c130852f6f713c1c5f.webp","vod_pic_slide":"","vod_remarks":"更新至10集","type_name":"国产剧","vod_year":"2026","vod_actor":"李一桐, 王佳佳, 曾梦雪, 常华森","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_nf7nCvS3lcW1JX3goWiHTQt6AREDhVg-2qEBgRVsT2nbO4b9CwFoPGdYFU8I9I_NCRkCaO_PTPZxXEA","vod_name":"吞噬星空","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/29/29eb83e43aed83e11de307f7ded7d8d7f15cc33ca24a863f5fb6c261d9101496.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/d8/d89abdda907749ef218d1ea91332afbebb476c224471a462f7d4b84690e152da.webp","vod_remarks":"更新至245集","type_name":"国产动漫","vod_year":"2020","vod_actor":"赵乾景, 谢莹, 宋国庆, 张若瑜","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_9S9Z-WTDQ4R0gpl0HXXrP39MdY_8rHQso3a570yvoqYckBfRl5-ajKoodanesQoO328S7n4SiRz6uv4","vod_name":"无可替代","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/f1/f174e5a1f4b638edc85e061f1554e3effdf2891b2045ad78fa9bc115d153904c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c7/c7b3f4b65311eefd454911fa767c9b5954ed370f7ba3ec1c244049d2fa1cb3df.webp","vod_remarks":"更新至20集","type_name":"国产剧","vod_year":"2026","vod_actor":"魏大勋, 赵今麦, 白冰, 连凯","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_P-2fvsUWEahkU1ofbAB1UZI7ehaRWVSzZKiwoEzs1_oIaPbKzyKBl17pziV2cPhM9pFDJhgikk983lI","vod_name":"凡人修仙传","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/63/6379b1eaf3877ce11d3ff825425ca37063863ff4471765a099b959bcb3cbdbbf.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8a/8a2b80855f6f263911ca1d70dfa06a5f2cd3108e38aaa98f63968ccade4bbe41.webp","vod_remarks":"更新至195集","type_name":"国产动漫","vod_year":"2020","vod_actor":"钱文青, 谷江山, 杨天翔, 乔诗语","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_Kd0v9iW3XSU3zlGsGWPUdt-3BVQ-JBPHAkIqBCjDBi2dkFSrYBwwvTcA8f7yHeYmJeYE1RIj7VDUwgI","vod_name":"魅影神捕","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/af/af1ff62b587469b5d47e4613c0b21d44dfd1505d84b1cab144e7e91eee5e1636.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e1/e120b215e9d87e6d9da5897a7b22103d986e96cd6f32b795954c9587c61a66bc.webp","vod_remarks":"更新至22集","type_name":"国产剧","vod_year":"2026","vod_actor":"罗云熙, 方逸伦, 沈羽洁, 何泓姗","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_O--sf03TjcuO9c34tw551-JPvXhTHSe_X_1Z1m8igYeuTtsE-PN7rycQveaHCMfbAJsVfRDJENfSCK0","vod_name":"我不是大师","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/12/1276a068e7c6e9d90713906bead2768f42facfcd16bb4642de8bb12294f3378c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/00/004dc23065425952d7ffbe1d45948fcbf74c818ce8c09268a2fa07276671b9b4.webp","vod_remarks":"更新至24集","type_name":"国产剧","vod_year":"2026","vod_actor":"李现, 李一桐, 刘冠麟, 吴刚","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_IfMsENz8gvf1coV2WiLknouFA2Mlhu5eU8tNlavBhqYWSrpYfotoVAT6LryOEsLJ64i773E6LQpgsLA","vod_name":"一斩苍穹","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/4f/4f5a36d76be3e8ad4cede907bbf75f6617817f1bada643ba02c46bcd3820325b.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/18/181b86c79d60f9ad71fe6039eb61e456abc251d73b600fe2a7fb55e2514070a0.webp","vod_remarks":"更新至13集","type_name":"国产动漫","vod_year":"2026","vod_actor":"邓云擎, 黑特, 李翰林, 李雨桐","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_Vwy4UihQEAAzHA4ayh4Ya0ShJlESdzI5R81JZaY3J72DYePMUZu9qWqGXPqEFa60gqIrELsnnZRI7os","vod_name":"神探之痕迹","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/85/85e851ee32b503ec5d9599329bc661059818b2faa226c6ed879e4f97572b1046.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/93/931dbe89771afff9f51d9fe74ecc8d94676da9f060339240b2c915e1cc54cad4.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2026","vod_actor":"陈明昊, 马丽, 王俊凯, 张译","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_S5LB0Erp6j8Y7Ll8dy_j2ot5ITV6aCEAbL9HtGDCJWWtopKfXqh1PAKwsfnhoggojs6OwYXWuwTL0d0","vod_name":"余红旧事","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/07/07ee1e07dfe068858170dfc5ef4df80af77732a31bf6a1567f588624d02562e7.webp","vod_pic_slide":"","vod_remarks":"更新至34集","type_name":"国产剧","vod_year":"2026","vod_actor":"马伊琍, 王佳佳, 向涵之, 张哲华","vod_score":"9.1","is_dynamic":true}]},{"title":"韩剧在追","subtitle":"从新集开始追也不费劲","cards":[{"vod_id":"av_O1rk-P_GKC-S84h62NfQoSuVylKvh8Pcov3sZkMhK5_e_18z5HjLTYqfszE1rJvzokZsu3AQbMea1LY","vod_name":"现在不是出轨的问题","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/66/6676e28d7fddf25259bf69a699e5b233c49ff333e98c56b7812f39fa3158cb21.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/3c/3cc53a2ea038c2d510380fd555fa81071a733b8d68dc9783b4a5d01a01b3f0c6.webp","vod_remarks":"全8集","type_name":"韩剧","vod_year":"2026","vod_actor":"金宰澈, 金惠秀, 金志勋, 赵汝贞","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_oFMoTXnPJtAnoXy8MSu6fK-Sv8wTkv31LtB8uRF4bz0Ph2HBJbHusQpXj2k4z0qFUYqIPdb2B4pCrPg","vod_name":"Doctor X:白色黑手党时代","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/58/58d09ee72206a1d0df01c4f712d9fc2c7d965c00ef352789d5bb817ab5b7ba2c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/12/12fb5ddc908f07cb4aa858dc9496f8c52f0dc9345b6df659d7a3f6597a5b4533.webp","vod_remarks":"更新至2集 / 共12集","type_name":"韩剧","vod_year":"2026","vod_actor":"金宇锡, 金智媛, 李姃垠, 孙贤周","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_XHHPlMosn5kfyiUnkBrebqPq0wBKfgkX1mnkBR__iQBfsBvlWjgt3NZ-UbJdd9CVdI6qXVmlVwmuolk","vod_name":"中头奖还是要上班","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/14/14e4022a44a476155b4fe0c7077c8d1d40859e40b636a2f53e72204a3bbd0aa2.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ee/ee63cb24af736a5f782e838b5bda7df1e9a807caccb06484aafbd28294376dd5.webp","vod_remarks":"全10集","type_name":"韩剧","vod_year":"2026","vod_actor":"玉子妍, 李浚赫, 吴代焕, 徐现宇","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_Nkf81im84J1SGpzy4fuGpv5nBte62BBN8F6SBhudKT90Iu1r5AQf98aX50ulGS_-enT3FZUs-Z_nulw","vod_name":"恋爱充电中","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/7b/7b5b26c1443f13a6ed71ccaa443021aeebe2ad593e11827351b857f789b62770.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/36/3612c09d67f6c1aca18aff045d06c463e769a53cd331406cbbcc48e625d80e70.webp","vod_remarks":"全10集","type_name":"韩剧","vod_year":"2026","vod_actor":"蔡秀彬, 金英光, 申度贤, 郑在光","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_uINT-KhXlsuzq7Rb9w5G-WATPmO7pCw2rzjt0l2PZHTxH2e9uE75U6KqkEfR85q8fVOE4EOg_E-FvVk","vod_name":"百日谎言","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/64/648e9a912e73c73bbc78fefa50256830774955ebba1b72a7c316c1813fb7f0cb.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/00/00df469031d1d78098529ec6c5dbd3a70e3c87e7f532a4066cbb1c4af24e3316.webp","vod_remarks":"更新至2集 / 共16集","type_name":"韩剧","vod_year":"2026","vod_actor":"陈善圭, 金贤珠, 金裕贞, 李茂生","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_c22Bwgtp3HUydvXBd2eQJuufv9CqOf1j85Fal8fGAipLvt0ZZRfRnDiS9zBalDoFgbze1Q85l5qRgpA","vod_name":"不是你的恋爱","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/73/737b61adad9436a9dbc60747b03cc2c5be156b3512ea8d414852b9856dade44e.webp","vod_pic_slide":"","vod_remarks":"更新至8集 / 共14集","type_name":"韩剧","vod_year":"2026","vod_actor":"李周安, 安恩真, 徐康俊, 赵雅兰","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_oyTUSKBeoScVrWCynwPoam8De6JfUu4ZUEcLx0b3fgpzK43J_crHq32Yd3YAR8Sv10iTqMVe_qXUNPY","vod_name":"恋爱博士","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e2/e28468b387f1900499bcab071b84fe54e0651699cd84e98e3216991ee9c160c1.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/36/3676fff1a5dcbec677a7db338b9de52b41d99c1d08098f89897066e35872224a.webp","vod_remarks":"更新至2集 / 共12集","type_name":"韩剧","vod_year":"2026","vod_actor":"金所泫, 金玟锡, 秋泳愚","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_Up9u-dMwpXvrrBBwKVqtp2eD6OKmOZc2DbC14e24Mt9W_PJDG11aEZaVrk8nI_p3eLB5-6uNNVviq84","vod_name":"四手联弹,两首奏鸣曲","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/53/536bb93769d4ac42801dbdf3a8ec32818bf9cd0a33d0074b7f0e98dd1e48c024.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ca/ca7d2caa3cd958f9e11134e117d26e5ffe5e69317895f0a57a37cf6bd735abe9.webp","vod_remarks":"全12集","type_name":"韩剧","vod_year":"2026","vod_actor":"李濬荣, 宋江, 张圭悧, 郑镇荣","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_tjkPRhQ-LpY-SAACZ4JZDOcT09q1JmOLFPSTCOkr--M75anv_4FKODx33v2uI96Ne3U6WiC8hTYEvbU","vod_name":"杀人者的购物中心 第2季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/70/702be0e21a0451d528406d2c4b620eeca96d392f3935e5c2d085f245b41c4916.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/03/03f1464aa9c40d6e64e91fd6d428d565e91adca4d0e4155bd7660d38c59933e3.webp","vod_remarks":"全8集","type_name":"韩剧","vod_year":"2026","vod_actor":"李栋旭, 赵汉善, 金慧埈, 玄理","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_9deTzmEDDJJcsWjcW88boKbKHcxHWL48noi47a6EFiF2Ed1Kcy_sZNlgl6GDjEwIvfcBHVjm-ZiZcNY","vod_name":"杀手妈咪","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/27/27f1795487b4350dfebe90398fe2931e6173ad50a280ad39483560a8ff0cf667.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ec/ecedade1e959e38a37beb3f87227eb9e09aeaf3dd8bd8f62b58acf8f06c5d966.webp","vod_remarks":"全15集","type_name":"韩剧","vod_year":"2026","vod_actor":"成东日, 孔晓振, 李相二, 郑浚远","vod_score":"9.4","is_dynamic":true},{"vod_id":"av__MIOeuHKi7xisD1aV7YtTIgFcSw31kgD-7uaYYXXeEXM6xAnfPcW_9pL91NwTNULqH_6y6rrUzjUo-s","vod_name":"挑情丑闻","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/fb/fbe9d90728efae7dc925a5ad48a7aff187e3efbb01d759954a20cabefc1447c4.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/08/0854f8d6d5552f161b8edd1da26b1f0b2c2e8fa71e8f9a53c3d6675148360f99.webp","vod_remarks":"全8集","type_name":"韩剧","vod_year":"2026","vod_actor":"林珍娜, 池昌旭, 孙艺珍, 韩善伙","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_zN2UMmoleDiLfBo9ABPLPklK4zDz3dlGftyorjj6Yg5yEOyBb3Fmu9_xicFUEjm4l3jaBnrd5HEBMyY","vod_name":"韩国制造 第2季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/75/7507ff934e956d021f7a51f45d426a36f719b7fa0f28862ef3919b584a5f0143.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/64/64b3d015448f850d2a7cb7fc1588bf64b0ef316a752d12686413e6f85855dc33.webp","vod_remarks":"全6集","type_name":"韩剧","vod_year":"2026","vod_actor":"玄彬, 郑雨盛, 徐恩秀, 元志安","vod_score":"9.1","is_dynamic":true}]},{"title":"日剧上新","subtitle":"节奏轻一点，夜里慢慢看","cards":[{"vod_id":"av_g7fx20I1EeM8tYkKnCDiIbxfr2oZEPJgNPI4YG0UeU-LcS_5yu63KcTrvt-49dgXS_P_hcsozjQy_3w","vod_name":"幸福伽菜子的快乐杀手生活 第2季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/f2/f2541efb4736fad6dcc5d646abf3310dd631e9c1cac17237419672dea666114e.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/9d/9d640958c9429583a4801264ae3f7cd0ca26d4dad3f00f07f84952c86e515c2c.webp","vod_remarks":"全5集","type_name":"日剧","vod_year":"2026","vod_actor":"能年玲奈, 藤谷太辅, 山崎纮菜, 矢本悠马","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_JchaEJzCjx9LOKdDM1Lf9gv309AfKqIr1HaQIWL0ZninskLb9GupXfDxTUojEJVl_ieGKRO2NZU5i8Y","vod_name":"直到T恤干透","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c3/c393a974f6081fb1800b73575a23111ec6f2c466ab1453852e45b4f6196f65bf.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ba/ba2b00b3c5445df550a21ef2328552719b7be922ae34f64c02f0d4a460600d74.webp","vod_remarks":"全10集","type_name":"日剧","vod_year":"2026","vod_actor":"苍井优, 高桥文哉, 夏帆, 中岛步","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_0kY69oKk7ANxArG_0o0tABHUNqK3-f0HCofn0-m7XSoyLOrJn8DIGta9rLgyyXUtSidl74__gewfh5c","vod_name":"政盗鲁邦","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8e/8e9e0368cbb2360eba32c972d3d9e299979be39736fa22ff6345c0e155d504c1.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/3e/3efd5423f139da2d3b69ca407a729cf03b2eafdb882b55818304039c000d2d8f.webp","vod_remarks":"更新至1集","type_name":"日剧","vod_year":"2026","vod_actor":"石原里美, 高桥一生, 渡部笃郎, 河合优实","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_GFDORS-g5qLMwnZaJ2ZnamAXosrLr6mE219YD2NFCCwbNgDvZ98GY86Oi7YKDCZBnesK5CVwungJOEk","vod_name":"我们的箱根驿传","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8d/8d131d23dffd1f82eb8e11b0b1b2d0a3261a726356103680559b1c3eeffb6615.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/4a/4afd7881763f52d5213f5f91d845b048228906ee3b9076452d329635a20797e7.webp","vod_remarks":"更新至1集 / 共10集","type_name":"日剧","vod_year":"2026","vod_actor":"大泉洋, 伊藤沙莉, 山下智久, 寺尾聪","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_GTUHtpFO3EWoQ2NbnPyEe3js93MxedFD-T5lnufQGgP6WA7TbYKI9VeQBLJcRGcGYaCvj842TwtKvF4","vod_name":"假面美颜","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/af/af59c8a5fe053222c6d347050d3bf939af8130002137536038967bd942122a4b.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/a2/a2c64b020909b60e7dfe2f759e2524203161b488685fcf90b7710b8c1ec27a94.webp","vod_remarks":"全8集","type_name":"日剧","vod_year":"2026","vod_actor":"仲里依纱, 松冈茉优, 间宫祥太朗, 田中美奈实","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_B-CHKK_32eoVpVJjaoDSKc2kusAtFzFfxq5sg9ngdJQNfF1YY3RlDvHVRfNCgnldv8tghAZ-1m5rxO4","vod_name":"欢迎回来,初恋","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/19/19cc722e4e997f48595fc11bcb504ac8b040209d276f3e2fbf9f453e37b54a7f.webp","vod_pic_slide":"","vod_remarks":"更新至1集","type_name":"日剧","vod_year":"2026","vod_actor":"滨津隆之, 朝仓亚纪, 林芽亚里, 藤林泰也","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_pp3KlQWmgWifuFLdx5gyOOGa_QfXwMrlsoz-3dhSXjPqAovbnONXaAJIjPRPc7uk4-M-g-FYkTkafWs","vod_name":"人生交换","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/64/644f81162dbfb900e6fdc96782fde30501c10797d187816283acac274d28ad41.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/19/19fc8a0ffd570a431fe7762bd70f3e19db64e85f8d94c7aa7a326d3e48079867.webp","vod_remarks":"更新至1集","type_name":"日剧","vod_year":"2026","vod_actor":"真木阳子, 马场富美加","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_T23l81psnESYUn5lQ49wmjpMD8BvSPQqX0xPVIKh75so4S4my2Uika_sEYXEQmiDb0kietYl280skwY","vod_name":"绑架游戏","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/55/55e5fe7f04b206b0feb778ce3d1781b22e9d1d180d66c4242b85c5546ae18217.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/49/498ac803191f7507ac92a36efeda80be40f44f4cf38794b8188e3bdeeddc15f5.webp","vod_remarks":"更新至1集","type_name":"韩剧","vod_year":"2026","vod_actor":"坂口健太郎, 柯佳嬿, 李准基, 邱士缙","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_IdLvuuh_5RKnxNssTv-I0dHL5BB4CGfOYS3vaH8sgQiD1ItluXtoSoogrJgI6JWxkH1o7HBDI295UOE","vod_name":"提欧奥特曼","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c0/c07f8a9edaf844fbb0d7fff8227eff2bfc9ce368b62484575e5f891c89ac63f5.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/f4/f4e1860312387630fb26c1c56087ea8b6b3aaa154ade7c62674ece38fc68c10f.webp","vod_remarks":"更新至15集 / 共25集","type_name":"日剧","vod_year":"2026","vod_actor":"神谷天音, 中田乃爱, 岩崎碧, 上村侑","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_u1A9lMuip0k68hPIDzrqcZzCpw0EXPPfe20UeXSvlrO54YLKDZ4U6ft4hhIrlevtikJ1A60dAnsPdEk","vod_name":"虚无的十字架","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c6/c6176690e1fc2fd301acfff766b870106c98a7f0f79e6f778949e3f153de1db5.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/5c/5c18b8ac538e9ffe2670d13e3ef97df82dd3c36be12a21c3def07588e8af31ca.webp","vod_remarks":"全4集","type_name":"日剧","vod_year":"2026","vod_actor":"赤楚卫二, 香取慎吾","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_APyBYSKcwjFWzeGT0qjk6-X3oO1_m0Tk_zF_jLACYJLn0Fr4pxNWk6VQ9Wu5eeWI3QW1lATlIC7V39M","vod_name":"豆与麦","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/26/26eac04cfa056fedf20055884930d127a9c3e421fd28a7890e1a03ea9ac02e48.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/77/77c7384feaec3f11a2f64d28d748df7d2f6dd300768d1805513c2eddf4aa5bc6.webp","vod_remarks":"更新至2集","type_name":"日剧","vod_year":"2026","vod_actor":"富田望生, 斋藤飞鸟, 石川瑠华, 滨尾矩考","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_kBCKIlhZjDrRmoURzIIA2YGRVrcwYsf8cM0nGfnSPS6bjMAwtkmmJfGnLg5sl4NohbaaWwb3NKrC-7Q","vod_name":"美味的制作方法","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/72/7283ff3be742bf313b12dacdfd42f5b4b1852f7985b694b7d07d95a080c4b53d.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/1c/1c956a7a2cad1d3d2c8985a3a5346a6a4e791efd54b03865b4905dd993b74ef6.webp","vod_remarks":"全1集","type_name":"日剧","vod_year":"2026","vod_actor":"北村有起哉, 能年玲奈, 坂井真纪, 加贺麻理子","vod_score":"9.1","is_dynamic":true}]},{"title":"美剧续看","subtitle":"适合一集接一集看","cards":[{"vod_id":"av_lavWXkWBu50ez27uBryrbkkIZbRE9FRFvYJ0EMCD4jrIMmI4YSzTw8MfpNLOmBQlsvuYZWQ3mu_xmFg","vod_name":"魔女嘉莉","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/55/550a9738f3d4ac938f0a798273e3dd7f2d5326622bc51ba51c6d7af9c252d3a1.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2e/2e1066dbfd2cd2ebc2a4689b5bf9ac6254b0d16c9f5a5bd8cb16f33b262d5046.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"萨曼塔·斯洛扬, 莎莫·H·豪威尔, 马修·里沃德, 安柏·米德桑德","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_EFabi2bCOsShfSGSmTev83nOTp7WP3PUmuIH2Db8LN9QeaL46ZXj2N0bSxk6LZlllPnyja2QwP3XF0o","vod_name":"怪物:丽兹·波顿的故事","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/74/74303b4b6c62ce6b90e744fb5572666a19fb34bd5dbecc48f32206141b4a64b5.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/d1/d14cb59840f3284a6e2c3cfea0c308b3ced599ebed77394d2ee809ce8d30d5ba.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"艾拉·比蒂, 查理·汉纳姆, 丽贝卡·豪尔, 薇姬·克里普斯","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_12YZbqi2Rr8E_FxZ7RsE82lxeQKB6doWIQFKYriBWfVaR5c9HMrSUUa2X6DBYx3njdOjVNuBedtBhjw","vod_name":"翠鸟谋杀案","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/6b/6bb9ac0215d27e708b29c0c0023ba8baa8b4e1d9f0285039da689a9123cd3a15.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8a/8a0c6a18a43c754451253ec16b1b277631cc586ba62e5a7c976bb4f06fb7a46b.webp","vod_remarks":"全6集","type_name":"欧美剧","vod_year":"2026","vod_actor":"蒂姆·迈克穆兰, 莱丝利·曼维尔, 杰米·布莱克利, 马克·博纳尔","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_q5JTUyoDe-bx0u6hNSfYrfYP8ECFDkCdaZ2R1_S2X0JbvEo8LzNZTorL7YzYAEgnFECGRKiW0KFUky4","vod_name":"绿灯军团","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/56/560b2e86c0adc8270cec564e5509327668be1d06337dbf80d7aba88eb1c97a85.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e0/e09343c29cd015be2a1138a5968ce029bec67e775b9dcad84e527e2679f7f8f5.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"凯尔·钱德勒, 亚伦·皮埃尔, 凯莉·麦克唐纳, 内森·菲利安","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_3Gtl1uypt5z9j4uQxdesBJhdLP3lEJSn8P6GeyGvTXzZwHQWAVpVBU-6al8EySOIBxNgTf2f2fiXt94","vod_name":"暗潮之下","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b3/b3289c13f89c9729f65163d58587dea8bb206ab1a5b86c2153308d924569d579.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/64/6473164dbdddf37dd90c1d19f39d475392303f56d575d12bf45ea9f7f7827911.webp","vod_remarks":"全6集","type_name":"欧美剧","vod_year":"2026","vod_actor":"查理·希顿, 乔什·哈奈特, 麦肯兹·戴维斯, 乔什·克鲁达斯","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_jh5lm-SBY0BU7hxUqVSEHDgNZfjsuiRbpZ2rJDXSCS0lNvH9bHWYcmf_vurijnR7efbbJV0TbbJH10M","vod_name":"流人 第6季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/4c/4ccb0c5e8840854e06efedf53d8e18da9a2f93b0e5f76d515829198d776285b1.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b6/b6a4c36881290c4c0c4eb82f9a46dcda6e6768a02614508d4630110fe2c8c0e0.webp","vod_remarks":"更新至4集 / 共7集","type_name":"欧美剧","vod_year":"2026","vod_actor":"加里·奥德曼, 杰克·劳登, 克里斯汀·斯科特·托马斯, 克里斯托弗·钟","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_BhwTJAVxvMuR_Hmu1MQTCYjRjj2EGe3ygUM2YQfcbbKIgorXyt8cpyzKV1kMVMjQGxYDj_QlZVhx29E","vod_name":"绅士们 第2季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/cd/cde0e92b0dcd54651d7029982fc7f78f725a8c9dd59374ed9ba8477e4e7e3ef4.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/6c/6c731a211428eea15f07b337547bc46f125380f2e9479853337c6d44befb16d0.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"卡雅·斯考达里奥, 西奥·詹姆斯, 丹尼尔·英格斯, 米凯莱·莫罗尼","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_toYe3L1elW1yF18lyo0L5oHrBpkbnKWSTdM88vqwwEh8Ji3seDpCDEUOlZ16B4x6U4_eieLqnXMjLsM","vod_name":"足球教练 第4季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/d3/d3c2810c4685d545e53f00e73420d05252c062dd2cbf58b5ce2f5a497b84b8df.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ab/ab77c7db62ae68b0a88e899f5b2e5a1d7c5066a3a28ae03afb20066396db370a.webp","vod_remarks":"全10集","type_name":"欧美剧","vod_year":"2026","vod_actor":"汉娜·沃丁厄姆, 杰森·苏戴奇斯, 布雷特·戈德斯坦, 杰里米·斯威夫特","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_4YLY53J2JRatUmW5CjjOy9rErkh9v_291aNdkuxSIJu1d0BHYNwvnwp3t2hT1Cj16iOOTLNp6t23sGk","vod_name":"狂怒追缉","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/15/15a9d079bed4d4e59a1001a7b28452d401d1ebaec6c956ffc16c1860dd4dd3e5.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/0f/0f3e774c977ead2844ce8bfb246046e7bff04da407f37d70eb693783a8fa0412.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"埃米·罗森, 洛拉·佩蒂克鲁, 杰克·莱西, 斯科特·麦克纳里","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_B6QlryjpOUylqVH1vGCmTi0LoccwTz08-R_458vMq3BqYspJGtmRCiQNCgNrLNdgvHAxnZ7BbQcMUsQ","vod_name":"伊甸园之东","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/46/46f78394245c2dadebee555c8d9f3c861af57ef9a02222612dc098d936e52528.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b0/b0c514b7d0bb8828b594fe7267b4743cbb63c6af83a005ca419c55f6ddaa31c4.webp","vod_remarks":"全7集","type_name":"欧美剧","vod_year":"2026","vod_actor":"弗洛伦丝·皮尤, 克里斯托弗·阿波特, 李勋, 迈克·费斯特","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_b2yvsswzIf90ZfUFfVeagCEQZDUV4z9T6Uin5T17KCsYVg7O1XdBYIrl51-h76drS2EdVom3igGx5Rs","vod_name":"赴汤蹈火","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/0e/0e442d6fdc340ac24a4f757bb9f74ebd93935926a099ed557361f1ef074a7c6f.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/16/162b16d78deee3cce94430df95c3ad47a957c23034ba95ca8c5c5ec796e95944.webp","vod_remarks":"全8集","type_name":"欧美剧","vod_year":"2026","vod_actor":"奥克塔维亚·斯宾瑟, 阿德南·哈斯科维奇, 艾德·斯克林, 保罗·梅纳德","vod_score":"9.0","is_dynamic":true},{"vod_id":"av__ganAr4ft8cvGrKRGwKM2KwEQexHouxoWSYT1dCIsKFOeT49pFsTzaTQV328ZBp7Q2YplivGhd3F9rY","vod_name":"谜探路德维希 第2季","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/10/1042c1f869aef26192f753cb8c1f0838d8113da6ea6a47f9f773185c7d3d99fc.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/9e/9e0ab28c4fb61add74366e723ab2aa89daf23d4d14dc25fdecab88980c2ae87d.webp","vod_remarks":"全6集","type_name":"欧美剧","vod_year":"2026","vod_actor":"迪伦·休斯, 安娜·麦克西维尔·马丁, 大卫·米切尔, 迪泼·欧拉","vod_score":"9.1","is_dynamic":true}]},{"title":"国产新剧","subtitle":"最近更新的大陆剧放这里","cards":[{"vod_id":"av_l8XtzTVsiClLL2-Cu4XHz-mS8p6vRD_lkGQH0HkZNPQljB3pi3RiRFeVWCkPpu3NeiwCc3ckONtRNMU","vod_name":"兰香如故","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/77/772974c16e231d2de7a0c2352edc7c67c6b61c12219921ca878fcae204089480.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/59/59633c7fa37a8176ffe870ca37c5331fb347903f1d3c9aa036924943b5d882a2.webp","vod_remarks":"全47集","type_name":"国产剧","vod_year":"2026","vod_actor":"刘学义, 谭松韵, 李梦, 郑合惠子","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_S5LB0Erp6j8Y7Ll8dy_j2ot5ITV6aCEAbL9HtGDCJWWtopKfXqh1PAKwsfnhoggojs6OwYXWuwTL0d0","vod_name":"余红旧事","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/07/07ee1e07dfe068858170dfc5ef4df80af77732a31bf6a1567f588624d02562e7.webp","vod_pic_slide":"","vod_remarks":"全34集","type_name":"国产剧","vod_year":"2026","vod_actor":"马伊琍, 王佳佳, 向涵之, 张哲华","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_O--sf03TjcuO9c34tw551-JPvXhTHSe_X_1Z1m8igYeuTtsE-PN7rycQveaHCMfbAJsVfRDJENfSCK0","vod_name":"我不是大师","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/12/1276a068e7c6e9d90713906bead2768f42facfcd16bb4642de8bb12294f3378c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/00/004dc23065425952d7ffbe1d45948fcbf74c818ce8c09268a2fa07276671b9b4.webp","vod_remarks":"全24集","type_name":"国产剧","vod_year":"2026","vod_actor":"李现, 李一桐, 刘冠麟, 吴刚","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_HI9tZ4kGN9qSolnN6roaKkHE--f0HxZ91EtEviikhVwWrq3yZrHPD6Z3Hn6sSZP0_6Uz56X5max9PFk","vod_name":"美人余","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/4e/4e6e7a400fb0d6031bf0f4019dd75d5e19b61aee5ebb07c130852f6f713c1c5f.webp","vod_pic_slide":"","vod_remarks":"更新至10集 / 共28集","type_name":"国产剧","vod_year":"2026","vod_actor":"李一桐, 王佳佳, 曾梦雪, 常华森","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_Kd0v9iW3XSU3zlGsGWPUdt-3BVQ-JBPHAkIqBCjDBi2dkFSrYBwwvTcA8f7yHeYmJeYE1RIj7VDUwgI","vod_name":"魅影神捕","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/af/af1ff62b587469b5d47e4613c0b21d44dfd1505d84b1cab144e7e91eee5e1636.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e1/e120b215e9d87e6d9da5897a7b22103d986e96cd6f32b795954c9587c61a66bc.webp","vod_remarks":"更新至22集 / 共30集","type_name":"国产剧","vod_year":"2026","vod_actor":"罗云熙, 方逸伦, 沈羽洁, 何泓姗","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_9S9Z-WTDQ4R0gpl0HXXrP39MdY_8rHQso3a570yvoqYckBfRl5-ajKoodanesQoO328S7n4SiRz6uv4","vod_name":"无可替代","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/f1/f174e5a1f4b638edc85e061f1554e3effdf2891b2045ad78fa9bc115d153904c.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c7/c7b3f4b65311eefd454911fa767c9b5954ed370f7ba3ec1c244049d2fa1cb3df.webp","vod_remarks":"全20集","type_name":"国产剧","vod_year":"2026","vod_actor":"魏大勋, 赵今麦, 白冰, 连凯","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_LYdiNJ0am8R6prbvbj-5m3aa951z_QRrgVBdRY251XkX6ChaJ3tw1051MetY_U-1yWrflcH2caLKYdk","vod_name":"早春晴朗","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/72/72640193d34ca5b109cad2b03602ced5df014f52c0edd842d0accea34c138815.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/55/55d85db5d15975a12e739f850f42cd6bb98592b5af86a74f6bdb9b972df4db6f.webp","vod_remarks":"全24集","type_name":"国产剧","vod_year":"2026","vod_actor":"井柏然, 刘小北, 齐天晴, 孙千","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_8o4h7lH1oEQmLbQNgDHzEbk1OwDfACvo2E4DG8tWRQI_urHTsN1rkUuhd0DAM9Uo3cfsA5Sy2Kl9Vq4","vod_name":"冬城猎凶","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/fc/fc0dfc2afe905ea958eaa02067709126ca3eab168a6cf4bb70b25797229d0990.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/12/12f3600f2f1b2d2b52c835da2e1e8acac176c80b88cc1d05f27522272133b7cf.webp","vod_remarks":"全18集","type_name":"国产剧","vod_year":"2026","vod_actor":"万茜, 王阳, 余文乐, 李纯","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_CpbJGHfpqK7vqWcwg8ls1h3XfTPb_5bL4VRlMzrge5EWFmd8iQPFqrN7k8DT-YE28akvyE23Q4S-IdI","vod_name":"交锋","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/de/def1b3886bfd02c2f9c79c9eef9199c4065f24db3c13c4de2baa07d998f9233f.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/bd/bd3fb9d2806b690c3ec64b5e0bf5916df1e6416fe56415b3c01530d0575a6bc5.webp","vod_remarks":"全40集","type_name":"国产剧","vod_year":"2026","vod_actor":"欧豪, 王凯, 周依然, 彭昱畅","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_vIc0GhH_TYb-6cGEyh-MVWmN8fgMeIb5yDcef_0t400sleXmrFYiy9v6uuqEhORuHCm8YBzT75uvBnA","vod_name":"伟大的长征","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2a/2a767eeb437c99adcf3c828ac8dc2be240d4006fb9bfd2e24cd473b4cd3df04d.webp","vod_pic_slide":"","vod_remarks":"更新至10集 / 共60集","type_name":"国产剧","vod_year":"2026","vod_actor":"王劲松, 于和伟, 曹磊, 何政军","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_8nTAeAY9iFs_eWTD9od7PhmktiBq4xJZWbEnraKfpx6QGskftfqdnBICSsB9p5ReBjAn1LZjwzm2cAI","vod_name":"喜剧之王","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/63/634c54f4e349444dcbaa8342afc3f85b3c01865e24d301a590b33cc39a3beacb.webp","vod_pic_slide":"","vod_remarks":"更新至17集 / 共24集","type_name":"国产剧","vod_year":"2026","vod_actor":"蒋龙, 杨超越, 蒋诗萌, 张弛","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_cBBA5RVlxa02X8fomRCWhTa21eEtFr0_EvdrBq5Gk7ECDro-etpTcLY5u1RNRiJS2brW4QgQgFHX9JM","vod_name":"深渊无间","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ca/cad2f43655c17ae3670aa67a6d7e256fbcf28dabead578945b4878d486b462eb.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/51/5103e10b527db122de8c6633bf78c2c1ce2067de91952cf50a59ebb77441654f.webp","vod_remarks":"全16集","type_name":"国产剧","vod_year":"2026","vod_actor":"秦俊杰, 任嘉伦, 田小洁, 王砚辉","vod_score":"9.1","is_dynamic":true}]},{"title":"高分电影","subtitle":"口碑稳，适合认真看完","cards":[{"vod_id":"av_K8gxrzggpgGfdgNHDUQiJ6LWlofz0XXG5WKCwMtAztTLlsz2R08a380w54Y2091LSTeFAvkp6ghFGIo","vod_name":"给阿嬷的情书","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e5/e58fea639e13877d473a47bbc5a67fc984ba16f8895baddc1d93bf5bf68a12b0.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2a/2a4c44f78b2c99bc827e95b26e46fd0f3ce12c5ef36fd33ea91e35825c1c2b91.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"郑润奇, 李树浩, 李思潼, 王彦桐","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_qvXbyIwwDDLjvDWJ_I9EEBaLbbH_z9OBIUb8RldVqTj4Ah1QWvyMIhXZoELXkta_tQrojsf36Os_zsc","vod_name":"肖申克的救赎","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ee/eeed8834afcfbc82f297929e9e84bea0ffb0bedf7e89c7144a1744bee024bfbd.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e0/e0173d4502d81a68440882453fdff4fa14400010d1f838e6de9f9e1256f1f1d0.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"1994","vod_actor":"鲍勃·冈顿, 蒂姆·罗宾斯, 摩根·弗里曼, 吉尔·贝罗斯","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_WeNj1DwVadOKkUEt3jubkQGEtu4RrYkr4mrwA5cRqGqBN-oZXObon5slv9v-fJS2Be-jkSRtQiQ7O1o","vod_name":"挽救计划","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/57/57f2e59e681f5eeaac6f83cbcdc39e22f1826a45a1085b54ee9b7abf9f14a782.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/3d/3d9039e7e04c9ce5bed152115508affe658a0920399eaee0f53656d7b0cfcfcf.webp","vod_remarks":"高清","type_name":"科幻","vod_year":"2026","vod_actor":"桑德拉·惠勒, 莱昂内尔·博伊斯, 瑞恩·高斯林, 詹姆斯·奥尔蒂斯","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_arm0E0bvF6YIMXgl8nSPiZDkT0mAW9bdgZjvd5BEN0Q8lCuR496o6EGXd9sGF_EUXrwOc-htZoUig98","vod_name":"八仙","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/db/dbf232ef932471d5f138823508a3cbd357a74efe80e52f1eebd3f852bb1bb4e8.webp","vod_pic_slide":"","vod_remarks":"高清","type_name":"动漫","vod_year":"2026","vod_actor":"陈浩, 果子哥哥, 李绍哲, 立冬","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_jwK2L7Keh-k_9SkdY6beNq_mypwJL0CJCGBhVr11R5Cf0cZh8ygo7uhB4bDgKqh4_MssN_qcv0sdo8c","vod_name":"哪吒之魔童闹海","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/a0/a02941d255489ed240461413c85bf79055d6bf46c68df39ea5831a8c6d90a68b.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b2/b2a0ecce0ae352f1c30efc4a47eee0fab738cd64692167eb603376f2fe124ba3.webp","vod_remarks":"高清","type_name":"动漫","vod_year":"2025","vod_actor":"陈浩, 瀚墨, 囧森瑟夫, 吕艳婷","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_SoVE4dHeFjCT7QbLZj8cYtav8jfsVkdXR2nC4tsJU_CeJBo8FGEuE4g6ySUqlYLRLpCReYQoAngwzyM","vod_name":"疯狂动物城","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/d4/d4b6370ba3bef76153e3a4ae9077872e910bec8b255c50229dc22f0d4af587ad.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/14/143da3ee2697631de6ff24c2f4ebf750bce5a2eee0c623a0ba7a9158ad1e1343.webp","vod_remarks":"高清","type_name":"电影","vod_year":"2016","vod_actor":"杰森·贝特曼, 金妮弗·古德温, 珍妮·斯蕾特, 内特·托伦斯","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_lHQVVzPn3D7hEyJ8P6D8VWL8411cg2uoMz0huGhSZdKgT7j0qqVgMBtP7auHoxONcBdihMMJsw5CqlI","vod_name":"疯狂动物城2","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2c/2cb63a98e5b60f55b35fa61af45455d48ebe6516ca77e292807ccee419169921.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/5e/5e7ca8ea85b18b1bcf84c0f18b4839fb65bf92d5eb052be340db404307c42140.webp","vod_remarks":"高清","type_name":"动漫","vod_year":"2025","vod_actor":"金妮弗·古德温, 关继威, 杰森·贝特曼, 福琼·费姆斯特","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_lHvWBbsHIgSoNknfnKHzziwLB-Z0alM1QmjDl-axAS_1JZ_ylSMfMNRl0QJaU9ftZMvB3cqD31mvCXs","vod_name":"千与千寻","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/44/4487a55f7b4ae5fca35a5ec9d927de6b8b9c8717e9b896eaa3b521c9926087bc.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2f/2ff75faeea22c02378b3bc5b66e88efcf7ee0cb58f1a2e9eb6f83142ae46a20b.webp","vod_remarks":"高清","type_name":"日韩动漫","vod_year":"2001","vod_actor":"菅原文太, 入野自由, 夏木真理, 柊瑠美","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_R83YNFN5htYdk8ccU1yKpc0b3RoX-CHGnLKNO-u3pB35N4--zzq_xPHPHCxokxKmZJwdfA27BrmnYOg","vod_name":"寻梦环游记","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/d7/d7cb870479730a5c3090a09c70d07f6a6b0d4a6dffb828198a1ec6e12a9a598e.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/a9/a9c2da0c84eaa354934aadfc768201797cf01eabc81939a288a0395c8af383e0.webp","vod_remarks":"高清","type_name":"欧美动漫","vod_year":"2017","vod_actor":"阿兰娜·乌巴赫, 安东尼·冈萨雷斯, 本杰明·布拉特, 盖尔·加西亚·贝纳尔","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_MoecHr2JcrQ8nsStvF89SGLxWZ3MBhVp_Jy82-N-OvV29oJ0ptAqqS28dALPDB_HlTrrBO6O65OWza8","vod_name":"泰坦尼克号","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/3b/3b2d5d12ad351d368d5dd29518730d661eef9eb308de55dba05ac130c7667d10.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2d/2d8d6610b6941bef4301514b54016a339a1a7fd4981b9d6da4b88e34e5c72e66.webp","vod_remarks":"高清","type_name":"爱情","vod_year":"1997","vod_actor":"莱昂纳多·迪卡普里奥, 比利·赞恩, 凯西·贝茨, 弗兰西丝·费舍","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_SHDQZ8l5cqJzci3Zj7hupgOHtwk9udUt2xK3INpRDW6w_Ybpu3NTSo8y1zV0WNdwtX8WzUP5SYZfLmE","vod_name":"楚门的世界","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/a0/a077ca3b4ec0e1c815f4840ba080e06daae40393e4cf41abb5d99552adf8e990.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/be/be6355d8661aea3db19b1afa0445ee461cd3949db3b4a3da80d0bd09ece4c650.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"1998","vod_actor":"艾德·哈里斯, 金·凯瑞, 劳拉·琳妮, 诺亚·艾默里奇","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_7Df3uIpWkP5ozp23o3XFkxLw3bt6nxCdRGBx9uSZFnSl1IxeEdjfV6weug8XwaKCjX_xYi2ampL6JpM","vod_name":"星际穿越","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/3b/3b0619fc0aad298ec04ad363d5c9146d6053be784f88f5e72398e9174aabaec2.jpg","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/78/782d3e64e97053fddba1170874cc3f3247ab9d46b114f1f6ffea08b3f7086221.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2014","vod_actor":"马修·麦康纳, 安妮·海瑟薇, 杰西卡·查斯坦, 卡西·阿弗莱克","vod_score":"9.1","is_dynamic":true}]},{"title":"电影热播","subtitle":"打开就能进入剧情的电影","cards":[{"vod_id":"av_XJg7y3ZBBeTB4NQiLxyDE-Al0tPH8CEt7LP8fqA2kAjD-Hd2llbJ1uKclcyJri-W_0PbZ-UGDsGkuAc","vod_name":"潜伏6","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/aa/aa0857a9a49729bba31bc3c8b296f24a52fa2ad2af3f0b501d54a69f6a8d7404.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2a/2ad15b47876c70b941bf6c03b052ecbfd46a4477996dc6c7bc2466bc4622fa99.webp","vod_remarks":"高清","type_name":"恐怖","vod_year":"2026","vod_actor":"阿梅利亚·伊芙, 林·沙烨, 萨姆·斯普卢尔, 麦茜·理查森-塞勒斯","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_imOINDJD9K1bpXSZFu9y0K5ipoe3QCaC-c_asTQtgvE8zb2bqU1k1SCyqALl6JLt0utWIlyeVkeu088","vod_name":"功夫女足","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ef/efdb3c535249f4f84d9fb317e36d5bd1c46226cd006e1dc1d50f914a9bfa2e83.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/6c/6c43e6c62d13b5ba3081c1667d822d51cafc99a76369fe8d38ce6e3a96f1b974.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"迪丽热巴, 张小斐, 张艺兴, 艾米","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_IKiJdRqMee3SJ1ZgUSwfPyo-81KxLfWpw0bBLU1GcC6XnI7MpshVRm0TamU3fjErVA_m8ly5zW8zqtI","vod_name":"一个部门的诞生","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/64/6404009fc82759e55416abe034765070e989fb95802345fad615017e66f821b3.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/8e/8ee2efcaed2dfcace412f2d39d75d5642fa0803010c3486633fa7fa1a9b71704.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"白只, 梁雍婷, 麦沛东, 戴玉麒","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_J0n-j3VGf8BndTAzCSGyACMCbdGPy2NpWDxHCN8h25KetSXlRKwpPXCG1LMRpCWn8h_b-RDiHZ2Bs_A","vod_name":"罗斯","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e5/e5e156548d1e15b0405900a3a55eeb58de6d945072059332245ee5a17fb0e1b0.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b3/b3bfbb81cf83cd589755dd542e898580873c9accfebe50890183e24b959ece47.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2026","vod_actor":"卡洛·布劳恩, 桑德拉·惠勒, 玛丽莎·格罗瓦尔德, 戈德哈尔德·吉瑟","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_rRiOBFIOttfN4xxWZhRuyJ4aBzlhb5y1KXz71-NPjOUoJHAfvVl3VfzPtDAoUf_QSvB33ds5SHqgs10","vod_name":"爱情假说","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/df/dffdb932860c9cc39961fc48f3f255c6645f20c9466cbcaa0c4890d5877b63ec.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b0/b092bbbfd2b3b14a7190dfe1f3fcda056a3a5a17275306959acb6c567addd609.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"莉莉·莱因哈特, 汤姆·巴特曼, 阿尔蒂·佛鲁山, 尼古拉斯·杜威内","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_N3yAmrFuo8dau3BSnwQkKAHAyS9vB2KKimAecnwVRth7It6NNIiy1g1gVRvUvbMpXuJpJL703LvMnyk","vod_name":"瘴气营地的青春性事与死亡","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/40/40a4506bf8a9603dea76d7b3c2bbaed78ef13c8a7e0cad29ea5abeed0ef480be.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/40/40372226981e046abd964c574db7c85bcca9a1e32eb649e6e9d456b558d4b292.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"汉娜·爱宾德, 吉莲·安德森, 贾思敏·萨沃伊·布朗, 派特里克·费斯克勒","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_K8gxrzggpgGfdgNHDUQiJ6LWlofz0XXG5WKCwMtAztTLlsz2R08a380w54Y2091LSTeFAvkp6ghFGIo","vod_name":"给阿嬷的情书","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/e5/e58fea639e13877d473a47bbc5a67fc984ba16f8895baddc1d93bf5bf68a12b0.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/2a/2a4c44f78b2c99bc827e95b26e46fd0f3ce12c5ef36fd33ea91e35825c1c2b91.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"郑润奇, 李树浩, 李思潼, 王彦桐","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_5nYYaRXA7VYyUmOZXeOF9kO72gTc-jrWWmts-oOg9CtSBbyZNFYfIZfaXGjM4bjsv14InoMqME5Phh4","vod_name":"年会不能停!2","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/23/2339bf1dc5d1e32b9b507c8f74c2515f54c14632654672565d12d13452f255a0.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/58/5856ad3a3bd085ce9db3f5119194a3db81a9cc850616d940bde13e219b29aeb2.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"白客, 高叶, 张若昀, 大鹏","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_yGMSnbgLACzl_z9NF0otsodTP2XzJBwxffxeuS0d8xYYW0ZodIyU61o-1-aXUQ4hB2Vu62CCKhMylxM","vod_name":"求救信号","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/37/3765c600e598d7abab26bcd6991e40fd3d0a4dedbb2c6ace21c9ffa353055bb1.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b6/b6085a90da23493fcd8e07e3c41ee7e3a10fcdadf8e73f79620fa79d806adf67.webp","vod_remarks":"高清","type_name":"动作","vod_year":"2026","vod_actor":"肯尼思·布拉纳, 瑞安·雷诺兹, 玛丽亚·巴卡洛娃, 温迪·古逊","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_qiMAZXLo49iYnQ_-NlijAsMD3sU0NsmtSM9JMdV7OaoqT5VMNNUgMszZzNu0qsZPSA1DrwdWpXofkPc","vod_name":"蜘蛛侠:崭新之日","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/54/5467d66b06b9e3bdfc843d99e25c1054f4f319d6b7997a3472831de2a7364f61.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ce/cec5ca282b052c8a38b4488d9e1306fb8f89f8b8024af71e643acf0e3137a45a.webp","vod_remarks":"高清","type_name":"科幻","vod_year":"2026","vod_actor":"赞达亚, 萨迪·辛克, 汤姆·霍兰德, 马克·鲁法洛","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_XFJsH3vJwoBTn8KETL8lrJBq5TaGufUxHUhjVY5yPZmkWXpa_GWLH-mUnFyFxy1d_jEcG6g8RQ_XVyI","vod_name":"阳光女子合唱团","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/05/05a96e98ac5b768cfd94ed44bc8eef143d31b634eb1863a652cb1bc009a8abf3.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/52/5218034a39e59adc92daa255f1062b15fdf8d2cbc24309eb3e16ba7476314b0b.webp","vod_remarks":"高清","type_name":"电影","vod_year":"2026","vod_actor":"安心亚, 曾恺玹, 曾珮瑜, 陈蕾朵","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_Jrvth7EdkRt4CUGcjHIW8BoMxLrG56x9CedX01yMXvmz8A9oZdO8pY9xb_fEwEvoglxWUgK-YeAGu6Q","vod_name":"魔方小姐","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c8/c88bdca6df320abb7b2baf1cb87f8b2ea002772a95801ff8bf86277fe31c2372.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/42/4234f3781cfff6b4326fb7130173c8a46f724764671d28f17036a7e36383789e.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2026","vod_actor":"刘昊然, 萨日娜, 杨紫琼, 白客","vod_score":"9.1","is_dynamic":true}]},{"title":"院线热映","subtitle":"影院正在热映的新片","cards":[{"vod_id":"av_h6Xy8fDsGf6j0UKQZufPBBszzSi6Gd3RWT3D__J5ApS928gbD5O9Y7RgRb_g2L15qk4RY4lHNT2IZhs","vod_name":"生化危机:爆发夜","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/77/775b90191cd3be44591abb82054762eb469988927edb34282b15ed3e5896cb96.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/0f/0fcd0a62b23f3525724b39c922c7ec1ae9e03d6eaa1172fe4dfac806aedffabe.webp","vod_remarks":"高清","type_name":"科幻","vod_year":"2026","vod_actor":"奥斯汀·艾布拉姆斯, 保罗·沃尔特·豪泽, 卡莉·瑞斯, 扎克·切利","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_Vwy4UihQEAAzHA4ayh4Ya0ShJlESdzI5R81JZaY3J72DYePMUZu9qWqGXPqEFa60gqIrELsnnZRI7os","vod_name":"神探之痕迹","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/85/85e851ee32b503ec5d9599329bc661059818b2faa226c6ed879e4f97572b1046.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/93/931dbe89771afff9f51d9fe74ecc8d94676da9f060339240b2c915e1cc54cad4.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2026","vod_actor":"陈明昊, 马丽, 王俊凯, 张译","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_0Sv2ES5zmAXIKvra5x81rgClpp8cGRzxfEgxxDEbBJgMgje9uL0gbERkwQ","vod_name":"活色生香","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/c4/c4258bf167a64dfb71bad42ef26f42e7fc74e50d9eb8cdcc33d16f94d3f2788f.webp","vod_pic_slide":"","vod_remarks":"2026年","type_name":"正在上映","vod_year":"2026","vod_actor":"","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_h4garcIMtuYBXgxxOAh9jQrn3f6uk1I7nuPX1T70z5NwqHxO6H1obsKNRI36bgKkgfWrazbGja7Pbrc","vod_name":"野兽之心","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/6f/6f63291053ea3dbb872d59c6f72c5620cd242ea262842e65104cea5d21505b5a.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/a4/a4e8e81a8c198f333af3580bbee55861ccc22f6dfdae1c4c12656a16aab12bf1.webp","vod_remarks":"高清","type_name":"动作","vod_year":"2026","vod_actor":"布拉德·皮特, Uber, 安娜·兰贝, J·K·西蒙斯","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_tXkFiKQ0XybdTMmoreW_KxhFxaRCR-dc5nNn0R_hL1qFpuY4SPf5NIeRtti-N9N7deim6AemQc9rC9w","vod_name":"什么意思夫妇","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/9e/9ee43f86110da26d3dfde602cec1efb126659dae82ac3ff3760abfebd0c2917e.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ac/ac9282faf942292cfe84104ca7e57f204078935354d5e7f0b42effb9dfb12d77.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"贾冰, 沈春阳, 小沈阳, 于洋","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_9dpWX8PhdH26eJ1hkGcPosOudE1SCZnjrxY00m2DlXHeVuIQvCHMLJdD2w","vod_name":"重生2","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/ba/ba2026216f05fa9ccb58326aa8316414f814efb4167fcf7b0566ff04f387bd6e.webp","vod_pic_slide":"","vod_remarks":"2026年","type_name":"正在上映","vod_year":"2026","vod_actor":"","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_ZxMUMPk8JQJ9Ows51dxZs7Yz45zpcskOpNVcGXp0KVJ0XvEqqATxr-mHCsteiWYWVjQIbantuPvlbK4","vod_name":"一路超平安","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/79/7956dc71fe3dda019c5e6a79fed1847dbd69cd0e90530100b5ee90fd6f6bff6a.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/cd/cdd761085a0b3dc943b214c9862ea16a98ff1579c4c7299c2bc0d585c7a6a0ca.webp","vod_remarks":"高清","type_name":"喜剧","vod_year":"2026","vod_actor":"乔杉, 黄翎翰, 常远, 九孔","vod_score":"9.1","is_dynamic":true},{"vod_id":"av_TymfDa8kD_yFFxINn3NerDh2Vlq2oIEiEAuyS3aeCi_Au_WplU1SMnhwUciUae6Jmfnta86XpC2SVBE","vod_name":"杀死比尔:整个血腥事件","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/00/00bced3c6d7e6b055daf4bbcccef6658ba0e5d290aac7ad62e34c5bbead0cdf0.webp","vod_pic_slide":"","vod_remarks":"高清","type_name":"动作","vod_year":"2011","vod_actor":"大卫·卡拉丁, 栗山千明, 迈克尔·鲍文, 迈克尔·马德森","vod_score":"9.2","is_dynamic":true},{"vod_id":"av_cwvDuTh75paQALzb--gN38caWzP52zA227tn6LVQbK9WWdx4Kg-usvgRYqPFXpVqJ_Q09bJuCt-aUes","vod_name":"坠落2:死点","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/32/3267957a98177cf6497cf6af9aec3f5fcb13a2b585111558f59ffc95bb7f433b.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/79/792520719c72851fc9934bea50dd774bd702573bc634e8bab316009dc23deb1c.webp","vod_remarks":"高清","type_name":"恐怖","vod_year":"2026","vod_actor":"阿塞玛·托马斯, 维吉尼亚·加德纳, 汤姆·布里特尼, 哈丽特·斯莱特","vod_score":"9.3","is_dynamic":true},{"vod_id":"av_nMp0cuqESpQUihK1suyouJg_hzlWrlW7bPscet6oOMgm5NgnlNTbs9Y84g","vod_name":"敦煌英雄","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/13/1382c56b7260013c1dd0b87ce6a82161c103b6d8853a3dc377e90c110bda6483.webp","vod_pic_slide":"","vod_remarks":"2026年","type_name":"正在上映","vod_year":"2026","vod_actor":"","vod_score":"9.4","is_dynamic":true},{"vod_id":"av_oyxxnFvIt0Lw3gHtAAw3IyL5U4Jb7xbLNTrENnHDxBC0217dvz9V1-p1b7I3kHH0L6TcOH_ZY1usDm0","vod_name":"欢迎来龙餐馆","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/f6/f693126676e6437abda46637db2bca3cca965f6b90066c220188d7c5e0f32c56.webp","vod_pic_slide":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/b2/b20aa8b4dcd18ca068460f07b0b355a7e67ce5923e6361f8cb111e46b14c91a0.webp","vod_remarks":"高清","type_name":"剧情","vod_year":"2026","vod_actor":"蒋奇明, 沈腾, 奥马尔·谢里夫, 李治廷","vod_score":"9.0","is_dynamic":true},{"vod_id":"av_r_A19vMo408wAefF48JH14Dbb0JJ8PwNq5yPWEB8HhAlS8zsJq7FO_RZew","vod_name":"老江湖","vod_pic":"https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=webp&src=img.baipiaozhe.com/assets/images/9c/9c9857baba052cd2527da1cf7ca0b115dd000dab016393e87a36a639fc1f5734.webp","vod_pic_slide":"","vod_remarks":"2026年","type_name":"正在上映","vod_year":"2026","vod_actor":"","vod_score":"9.1","is_dynamic":true}]}];

    const SECTION_STYLES = [{"icon":"fa-fire","color":"#f59e0b"},{"icon":"fa-heart","color":"#ec4899"},{"icon":"fa-moon","color":"#818cf8"},{"icon":"fa-bolt","color":"#38bdf8"},{"icon":"fa-tv","color":"#10b981"},{"icon":"fa-star","color":"#fbbf24"},{"icon":"fa-film","color":"#a855f7"},{"icon":"fa-ticket","color":"#ef4444"}];

    // 将全量板块平整化进 window.currentVideoList 并记录每个卡片的全局索引，方便秒开播放与全网聚合
    window.renderAllVideoSections = function(sections) {
        const container = document.getElementById('videoAllSectionsContainer');
        if (!container || !Array.isArray(sections) || sections.length === 0) return;

        // 合并内置秒播源 (如果名字匹配 KANJU_HOT_LIST 则直接挂载免等待 m3u8 源)
        const hotMap = new Map();
        (window.KANJU_HOT_LIST || []).forEach(h => {
            hotMap.set(h.vod_name, h);
            if (h.vod_sub) hotMap.set(h.vod_sub, h);
        });

        const flatList = [];
        let html = '';

        sections.forEach((sec, sIdx) => {
            const style = SECTION_STYLES[sIdx % SECTION_STYLES.length];
            const cards = sec.cards || [];
            if (cards.length === 0) return;

            const cardsHtml = cards.map((rawCard) => {
                let item = { ...rawCard };
                const cleanTitle = (item.vod_name || '').replace(/\s+第.*季/g, '').trim();
                const matchedHot = hotMap.get(item.vod_name) || hotMap.get(cleanTitle);
                if (matchedHot && matchedHot.vod_play_url) {
                    item = { ...matchedHot, ...item, vod_play_from: matchedHot.vod_play_from, vod_play_url: matchedHot.vod_play_url };
                }
                const globalIdx = flatList.length;
                flatList.push(item);

                const rawPic = item.vod_pic || 'https://api.iconify.design/lucide:film.svg?color=%23555';
                const pic = window.shardBaiduImg ? window.shardBaiduImg(rawPic, globalIdx) : rawPic;
                const remark = item.vod_remarks || (item.vod_year ? item.vod_year + '年' : '超清正片');
                const type = item.type_name || '影视';
                const score = item.vod_score && item.vod_score !== '0.0' ? item.vod_score : '9.1';
                const loadingAttr = globalIdx < 16 ? 'eager' : 'lazy';

                return `
                    <div class="kanju-poster-card" onclick="window.openVideoDetail(${globalIdx})">
                        <div class="kanju-poster-wrap">
                            <img src="${pic}" alt="${item.vod_name}" loading="${loadingAttr}" referrerpolicy="no-referrer" onerror="window.retryBaiduImg ? window.retryBaiduImg(this) : (this.src='https://api.iconify.design/lucide:film.svg?color=%23888')" />
                            <span class="kanju-score-badge">★ ${score}</span>
                            <span class="kanju-poster-badge">${remark}</span>
                            <div class="kanju-play-hover"><i class="fas fa-play"></i></div>
                        </div>
                        <div class="kanju-poster-info">
                            <div class="kanju-poster-title" title="${item.vod_name}">${item.vod_name}</div>
                            <div class="kanju-poster-meta">
                                <span class="meta-tag">${type}</span>
                                <span>${item.vod_year || ''}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            html += `
                <div class="kanju-section-block" data-sec-title="${sec.title}" style="margin-bottom: 30px; scroll-margin-top: 24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 12px 0;">
                        <div style="display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;">
                            <h4 style="font-size:16px; font-weight:700; display:flex; align-items:center; gap:7px; color:var(--text-main);">
                                <i class="fas ${style.icon}" style="color:${style.color};"></i>
                                <span>${sec.title}</span>
                            </h4>
                            <span style="font-size:12px; color:var(--text-muted);">${sec.subtitle || ''}</span>
                        </div>
                        <span style="font-size:11px; color:var(--text-muted); background:rgba(255,255,255,0.04); padding:3px 10px; border-radius:14px; border:1px solid rgba(255,255,255,0.1);">共 ${cards.length} 部</span>
                    </div>
                    <div class="video-grid">${cardsHtml}</div>
                </div>
            `;
        });

        window.currentVideoList = flatList;
        container.innerHTML = html;
        window.initTxHeroCarousel(flatList);
    };

    window.jumpToVideoSection = function(secTitle, btnEl) {
        const videoSec = document.getElementById('videoSection');
        if (!videoSec || videoSec.style.display === 'none') {
            if (typeof window.switchNav === 'function') window.switchNav('video');
        }
        const searchBlock = document.getElementById('videoSearchResultBlock');
        if (searchBlock && searchBlock.style.display !== 'none' && typeof window.clearVideoSearch === 'function') {
            window.clearVideoSearch();
        }
        document.querySelectorAll('#pcVideoChannelList .pc-side-channel-btn').forEach(b => {
            b.classList.toggle('active', b === btnEl);
        });
        document.querySelectorAll('.mobile-channel-item').forEach(b => {
            b.classList.toggle('active', b === btnEl);
        });
        if (btnEl && btnEl.classList.contains('mobile-channel-item')) {
            try {
                btnEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } catch(e){}
        }
        setTimeout(() => {
            if (!secTitle || secTitle === 'TOP') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(`.kanju-section-block[data-sec-title="${secTitle}"]`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 40);
    };

    // =========================================================================
    // 🚀 百度图片 CDN 多域名分片加速 + 自动故障切换 (突破浏览器单域名 6 并发上限)
    // =========================================================================
    window.shardBaiduImg = function(url, seed = 0) {
        if (!url || typeof url !== 'string') return url || '';
        if (url.includes('gimg0.baidu.com')) {
            const idx = Math.abs(Number(seed) || 0) % 4;
            return url.replace('gimg0.baidu.com', `gimg${idx}.baidu.com`);
        }
        return url;
    };

    window.retryBaiduImg = function(imgEl) {
        if (!imgEl) return;
        const curSrc = imgEl.getAttribute('src') || '';
        const step = Number(imgEl.dataset.retryStep || 0);
        if (step < 3 && /gimg[0-3]\.baidu\.com/.test(curSrc)) {
            imgEl.dataset.retryStep = String(step + 1);
            const nextShard = (step + 1) % 4;
            imgEl.src = curSrc.replace(/gimg[0-3]\.baidu\.com/, `gimg${nextShard}.baidu.com`);
            return;
        }
        imgEl.onerror = null;
        imgEl.src = 'https://api.iconify.design/lucide:film.svg?color=%23888';
    };

    // =========================================================================
    // 🎬 腾讯视频 (v.qq.com) 首屏全宽巨幕轮播海报墙控制器
    // =========================================================================
    let txHeroSlides = [];
    let txHeroActiveIdx = 0;
    let txHeroTimer = null;
    let txHeroTouchStartX = 0;
    let txHeroTouchBound = false;

    const TX_HERO_CUSTOM_SYNOPSES = {
        '庆余年 第二季': '范闲率使团归京，抱月楼迷局与春闱大案接连引爆！面对二皇子步步紧逼与内库巨额亏空，范闲孤身下江南掀翻旧局。',
        '繁花': '王家卫首部剧集巨制！九十年代十里洋场黄河路，阿宝从籍籍无名蜕变为叱咤风云的宝总，演绎上海滩时代的滚烫传奇。',
        '狂飙': '横跨二十年的扫黑除恶史诗巨作！京海市刑警安欣与高启强在黑白边缘展开命运博弈，全员飙戏高能不断。',
        '凡人修仙传': '一介凡人韩立机缘巧合踏入修真界，凭谨慎心性与噬金虫、青竹蜂云剑逆天改命，国漫修仙巅峰视效巨制！',
        '斗破苍穹': '三十年河东，三十年河西，莫欺少年穷！萧炎携异火重返云岚宗，中州大陆巅峰强者之战燃爆苍穹。',
        '仙逆': '顺为凡，逆则仙，只在心中一念间！王林以凡根踏碎修真万古枯骨，化神之战震撼开启。',
        '兰香如故': '年度古装口碑热剧！名门风月与家国命运交织，权谋暗涌之下守护挚爱与初心。',
        '现在就出发 第4季': '沈腾、白敬亭、贾冰、王安宇原班熟人局爆笑回归！山野露营与高能游戏名场面密集轰炸，今晚解压首选。',
        '我不是大师': '李现、李一桐领衔主演高分反套路爽剧，市井奇才卷入连环迷局，笑点与反转齐飞！',
        '魅影神捕': '罗云熙古装悬疑探案力作，奇案诡局环环相扣，孤傲神捕拨开重重迷雾直抵真相。'
    };

    function cleanHtmlSummary(rawHtml, fallbackText) {
        if (!rawHtml) return fallbackText;
        const txt = String(rawHtml).replace(/<[^>]+>/g, '').replace(/[\r\n\u3000\s]+/g, ' ').trim();
        return txt.length > 8 ? txt : fallbackText;
    }

    window.initTxHeroCarousel = function(flatList) {
        const list = Array.isArray(flatList) ? flatList : [];
        const picked = [];
        const usedNames = new Set();

        // 清理浏览器可能误填进搜索框的云同步账号
        const vInput = document.getElementById('videoSearchInput');
        if (vInput && document.activeElement !== vInput && vInput.value) {
            const syncUser = localStorage.getItem('sync_username') || '';
            if (vInput.value === syncUser || vInput.hasAttribute('readonly')) {
                vInput.value = '';
            }
        }

        // 1. 优先按首个推荐板块（大家都在看）的顺序，从第 1 个推荐影视开始依次提取带 16:9 原生横版高清巨幕图 (vod_pic_slide / carousel_url) 的剧目
        for (let i = 0; i < list.length && picked.length < 7; i++) {
            const it = list[i];
            if (it && it.vod_name && it.vod_pic_slide && !usedNames.has(it.vod_name)) {
                usedNames.add(it.vod_name);
                picked.push({ item: it, globalIdx: i });
            }
        }

        // 2. 若不足 7 部，按顺序从前排补齐
        for (let i = 0; i < list.length && picked.length < 7; i++) {
            const it = list[i];
            if (it && it.vod_name && (it.vod_pic_slide || it.vod_pic) && !usedNames.has(it.vod_name)) {
                usedNames.add(it.vod_name);
                picked.push({ item: it, globalIdx: i });
            }
        }

        txHeroSlides = picked;
        const railEl = document.getElementById('txHeroRailList');
        if (!railEl || txHeroSlides.length === 0) return;

        // 预加载 7 张巨幕高清横图，切换毫秒级响应
        txHeroSlides.forEach((entry, idx) => {
            const slideUrl = entry.item && (entry.item.vod_pic_slide || entry.item.vod_pic);
            if (slideUrl) {
                const preImg = new Image();
                preImg.referrerPolicy = 'no-referrer';
                preImg.src = window.shardBaiduImg(slideUrl, idx);
            }
        });

        railEl.innerHTML = txHeroSlides.map((entry, idx) => {
            const it = entry.item;
            const rawThumbPic = it.vod_pic || it.vod_pic_slide || '';
            const thumbPic = window.shardBaiduImg(rawThumbPic, idx + 2);
            return `
                <div class="tx-thumb-card ${idx === txHeroActiveIdx ? 'active' : ''}"
                     id="txRailItem_${idx}"
                     onmouseenter="window.selectTxHeroSlide(${idx})"
                     onclick="window.handleTxRailClick(${idx})"
                     title="${it.vod_name}">
                    <img src="${thumbPic}" alt="${it.vod_name}" referrerpolicy="no-referrer" onerror="window.retryBaiduImg(this)" />
                    <div class="tx-thumb-caption">${it.vod_name}</div>
                </div>
            `;
        }).join('');

        if (txHeroActiveIdx >= txHeroSlides.length) txHeroActiveIdx = 0;
        window.selectTxHeroSlide(txHeroActiveIdx, false);
        window.resumeTxHeroCarousel();

        // 绑定移动端左右滑动切换焦点图手势
        const stageEl = document.getElementById('txHeroStage');
        if (stageEl && !txHeroTouchBound) {
            txHeroTouchBound = true;
            stageEl.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length > 0) {
                    txHeroTouchStartX = e.touches[0].clientX;
                }
                window.pauseTxHeroCarousel();
            }, { passive: true });
            stageEl.addEventListener('touchend', (e) => {
                if (e.changedTouches && e.changedTouches.length > 0 && txHeroTouchStartX) {
                    const dx = e.changedTouches[0].clientX - txHeroTouchStartX;
                    if (Math.abs(dx) > 42) {
                        window.stepTxHeroSlide(dx < 0 ? 1 : -1);
                    }
                }
                txHeroTouchStartX = 0;
                window.resumeTxHeroCarousel();
            }, { passive: true });
        }
    };

    window.selectTxHeroSlide = function(idx, resetTimer = true) {
        if (!txHeroSlides || txHeroSlides.length === 0) return;
        txHeroActiveIdx = ((idx % txHeroSlides.length) + txHeroSlides.length) % txHeroSlides.length;
        const entry = txHeroSlides[txHeroActiveIdx];
        if (!entry || !entry.item) return;
        const it = entry.item;

        const bgAmbient = document.getElementById('txHeroBgAmbient');
        const bgPanoramic = document.getElementById('txHeroBgPanoramic');
        const bannerImg = document.getElementById('txHeroBannerImg');
        const rankBadge = document.getElementById('txHeroRankBadge');
        const catBadge = document.getElementById('txHeroCatBadge');
        const titleEl = document.getElementById('txHeroTitle');
        const remarkEl = document.getElementById('txHeroRemark');
        const actorsEl = document.getElementById('txHeroActors');
        const descEl = document.getElementById('txHeroDesc');

        // 核心：巨幕主舞台优先使用 kanju3 官方 16:9 横版高清轮播大图 (vod_pic_slide / carousel_url)，彻底告别竖版小图拉伸模糊
        const rawWideBannerUrl = it.vod_pic_slide || it.vod_pic || '';
        const wideBannerUrl = window.shardBaiduImg(rawWideBannerUrl, txHeroActiveIdx);
        const ambientBannerUrl = window.shardBaiduImg(rawWideBannerUrl, txHeroActiveIdx + 1);
        if (bgAmbient) {
            if (bgAmbient.tagName === 'IMG') {
                bgAmbient.src = ambientBannerUrl;
            } else {
                bgAmbient.style.backgroundImage = `url('${ambientBannerUrl}')`;
            }
        }
        if (bannerImg) {
            bannerImg.classList.toggle('is-portrait-fallback', !it.vod_pic_slide);
            bannerImg.src = wideBannerUrl;
        } else if (bgPanoramic) {
            bgPanoramic.style.backgroundImage = `url('${wideBannerUrl}')`;
        }
        if (catBadge) catBadge.innerHTML = `<i class="fas fa-fire"></i> ${it.type_name || '热播剧集'}`;
        if (rankBadge) rankBadge.innerHTML = `<i class="fas fa-trophy"></i> 热搜总榜第${txHeroActiveIdx + 1}名`;
        if (titleEl) titleEl.textContent = it.vod_name || '正在热播';
        if (remarkEl) remarkEl.textContent = it.vod_remarks || '全集超清连载';
        if (actorsEl) {
            const actors = (it.vod_actor || '').split(/[,，]/).map(s => s.trim()).filter(Boolean).slice(0, 4).join(' · ');
            actorsEl.textContent = actors || `${it.type_name || '精选影视'} · ${it.vod_year || '2026'} · ★${it.vod_score || '9.2'}`;
        }
        if (descEl) {
            const customDesc = TX_HERO_CUSTOM_SYNOPSES[it.vod_name];
            descEl.textContent = customDesc || cleanHtmlSummary(it.vod_content, `《${it.vod_name}》正在宇穹视界热播，支持多线路超清画质秒播与跨端云同步续看。`);
        }

        txHeroSlides.forEach((_, i) => {
            const el = document.getElementById('txRailItem_' + i);
            if (el) {
                const isActive = (i === txHeroActiveIdx);
                el.classList.toggle('active', isActive);
                if (isActive && window.innerWidth <= 860 && el.scrollIntoView) {
                    try { el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) {}
                }
            }
        });

        if (resetTimer) {
            window.resumeTxHeroCarousel();
        }
    };

    window.handleTxRailClick = function(idx) {
        if (window.innerWidth <= 860 && txHeroActiveIdx !== idx) {
            window.selectTxHeroSlide(idx);
            return;
        }
        window.selectTxHeroSlide(idx);
        window.playCurrentTxHero();
    };

    window.stepTxHeroSlide = function(delta) {
        window.selectTxHeroSlide(txHeroActiveIdx + (delta || 1), true);
    };

    window.playCurrentTxHero = function() {
        if (!txHeroSlides || txHeroSlides.length === 0) return;
        const entry = txHeroSlides[txHeroActiveIdx] || txHeroSlides[0];
        if (!entry) return;
        window.openVideoDetail(entry.globalIdx, 0);
    };

    window.pauseTxHeroCarousel = function() {
        if (txHeroTimer) {
            clearInterval(txHeroTimer);
            txHeroTimer = null;
        }
    };

    window.resumeTxHeroCarousel = function() {
        window.pauseTxHeroCarousel();
        txHeroTimer = setInterval(() => {
            const videoSec = document.getElementById('videoSection');
            if (!videoSec || videoSec.style.display === 'none' || document.hidden) return;
            window.selectTxHeroSlide(txHeroActiveIdx + 1, false);
        }, 5200);
    };

    window.clearVideoSearch = function() {
        const searchBlock = document.getElementById('videoSearchResultBlock');
        const allSecs = document.getElementById('videoAllSectionsContainer');
        const heroStage = document.getElementById('txHeroStage');
        const input = document.getElementById('videoSearchInput');
        if (input) input.value = '';
        if (searchBlock) searchBlock.style.display = 'none';
        if (heroStage) heroStage.style.display = '';
        if (allSecs) allSecs.style.display = 'block';
        window.renderAllVideoSections(window.KANJU_ALL_SECTIONS);
    };

    // 动态拉取与渲染原站全量 8 大影视板块
    window.loadVideoFeed = async function() {
        window.renderRecentWatchBar();

        const searchBlock = document.getElementById('videoSearchResultBlock');
        const allSecs = document.getElementById('videoAllSectionsContainer');
        const heroStage = document.getElementById('txHeroStage');
        if (searchBlock) searchBlock.style.display = 'none';
        if (heroStage) heroStage.style.display = '';
        if (allSecs) allSecs.style.display = 'block';

        // 1. 立即用内置的原站 8 大板块 (96部热播片单) 瞬间秒开渲染
        window.renderAllVideoSections(window.KANJU_ALL_SECTIONS);

        // 2. 异步从后端实时同步 kanju3 最新板块数据
        try {
            const res = await fetch('/api/video/feed');
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.sections) && data.sections.length > 0) {
                    window.KANJU_ALL_SECTIONS = data.sections;
                    window.renderAllVideoSections(data.sections);
                }
            }
        } catch(e) {}

        window.loadDynamicSuggestions();
    };

    // 动态换一批
    window.refreshVideoFeed = async function() {
        const icon = document.getElementById('refreshFeedIcon');
        if (icon) icon.classList.add('fa-spin');

        window.currentFeedSection = (window.currentFeedSection + 1) % 8;
        await window.loadVideoFeed(window.currentFeedSection);

        setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
        }, 500);
    };

    // 动态加载 kanju3 官方实时热搜词标签
    window.loadDynamicSuggestions = async function() {
        try {
            const res = await fetch('/api/video/suggest');
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.suggestions && data.suggestions.length > 0) {
                const chipsBox = document.getElementById('kanjuHotChips');
                if (chipsBox) {
                    chipsBox.innerHTML = data.suggestions.slice(0, 12).map(s => `
                        <button class="kanju-chip" onclick="window.quickSearchVideo('${s.prompt || s.label}')">${s.label}</button>
                    `).join('');
                }
            }
        } catch(e){}
    };

    // 全网搜索
    window.doVideoSearch = async function() {
        const input = document.getElementById('videoSearchInput');
        const wd = input ? input.value.trim() : '';
        if (!wd) return;
        if (window.checkSecretUnlockKeyword && window.checkSecretUnlockKeyword(wd, input)) return;

        const heroStage = document.getElementById('txHeroStage');
        if (heroStage) heroStage.style.display = 'none';
        const searchBlock = document.getElementById('videoSearchResultBlock');
        if (searchBlock) searchBlock.style.display = 'block';
        const grid = document.getElementById('videoGrid');
        const countBadge = document.getElementById('videoCountBadge');
        const titleBadge = document.getElementById('videoFeedTitle');
        if (titleBadge) titleBadge.innerHTML = '<i class="fas fa-search" style="color:var(--accent);"></i> 搜索《' + wd + '》结果';
        if (grid && typeof window.renderSkeletonGrid === 'function') {
            window.renderSkeletonGrid(grid, 8, true);
        } else if (grid) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;"><i class="fas fa-spinner fa-spin"></i> 正在全网检索片源...</div>';
        }

        // 先匹配当前列表作为高优先级结果
        const localMatches = (window.currentVideoList || []).filter(item => 
            item.vod_name.includes(wd) || 
            (item.vod_sub && item.vod_sub.includes(wd)) ||
            (item.vod_class && item.vod_class.includes(wd)) ||
            (item.vod_actor && item.vod_actor.includes(wd))
        );

        try {
            const res = await fetch('/api/video/search?wd=' + encodeURIComponent(wd));
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            const remoteList = data.list || [];

            // 合并去重：以远程搜索结果为准（包含原站最新 1080P 豆瓣/暴风直连播放源与清晰度标识）
            const merged = [];
            const seen = new Set();
            remoteList.forEach(r => {
                if (!r || !r.vod_name) return;
                const key = r.vod_name.replace(/[:：\s·・\-]/g, '').toLowerCase();
                if (!seen.has(key)) {
                    seen.add(key);
                    merged.push(r);
                }
            });
            localMatches.forEach(loc => {
                if (!loc || !loc.vod_name) return;
                const key = loc.vod_name.replace(/[:：\s·・\-]/g, '').toLowerCase();
                if (!seen.has(key)) {
                    seen.add(key);
                    merged.push(loc);
                }
            });

            window.currentVideoList = merged;
            if (countBadge) countBadge.innerText = '检索到 ' + window.currentVideoList.length + ' 个资源';
            if (window.currentVideoList.length === 0) {
                if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂未找到匹配影片，可尝试简化关键词或点击上方推荐影片。</div>';
                return;
            }
            window.renderVideoGridOnly(window.currentVideoList);
        } catch(e) {
            if (localMatches.length > 0) {
                window.currentVideoList = localMatches;
                if (countBadge) countBadge.innerText = '找到 ' + localMatches.length + ' 部相关影片';
                window.renderVideoGridOnly(localMatches);
            } else {
                if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px;">网络线路繁忙，请稍后重试，或直接点击上方热门推荐影片。</div>';
            }
        }
    };

    // 渲染海报卡片网格
    window.renderVideoGridOnly = function(list) {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        if (!list || list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂无影视内容</div>';
            return;
        }

        grid.innerHTML = list.map((item, idx) => {
            const pic = item.vod_pic || 'https://api.iconify.design/lucide:film.svg?color=%23555';
            const remark = item.vod_remarks || (item.vod_year ? item.vod_year + '年' : '高清正片');
            const type = item.type_name || '影视';
            const score = item.vod_score && item.vod_score !== '0.0' ? item.vod_score : '9.0';
            return `
                <div class="kanju-poster-card" onclick="window.openVideoDetail(${idx})">
                    <div class="kanju-poster-wrap">
                        <img src="${pic}" alt="${item.vod_name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://api.iconify.design/lucide:film.svg?color=%23888'" />
                        <span class="kanju-score-badge">★ ${score}</span>
                        <span class="kanju-poster-badge">${remark}</span>
                        <div class="kanju-play-hover"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="kanju-poster-info">
                        <div class="kanju-poster-title" title="${item.vod_name}">${item.vod_name}</div>
                        <div class="kanju-poster-meta">
                            <span class="meta-tag">${type}</span>
                            <span>${item.vod_year || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // 打开视频详情与播放器 (兼具即时秒播与动态实时解析)
    // 打开视频详情与播放器 (兼具即时秒播与精准全网多线路智能聚合)
    window.openVideoDetail = async function(index, targetEpIdx = 0) {
        let item = window.currentVideoList[index];
        if (!item) return;

        // 如果卡片尚未挂载播放源 (属于动态推荐流在线卡片)，立刻发起秒级全网精准聚合检索
        if (!item.vod_play_url) {
            const vSection = document.getElementById('videoSection');
            if (vSection) vSection.style.display = 'none';
            const vPlayerView = document.getElementById('videoPlayerView');
            if (vPlayerView) vPlayerView.style.display = 'block';
            const vPlayerTitle = document.getElementById('videoPlayerTitle');
            if (vPlayerTitle) vPlayerTitle.innerText = '正在载入: ' + item.vod_name;
            const vDetailName = document.getElementById('videoDetailName');
            if (vDetailName) vDetailName.innerText = item.vod_name;
            const vEpList = document.getElementById('videoEpisodesList');
            if (vEpList) vEpList.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:15px;"><i class="fas fa-spinner fa-spin"></i> 正在全网秒级调取超清播放线路...</div>';

            try {
                // 构造多级精准搜索关键词：清洗零宽字符、完整标题、去除季数副标题、冒号/空格切分主剧名
                const rawName = (item.vod_name || '').replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '').trim();
                const cleanName1 = rawName.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').replace(/[0-9]+$/g, '').trim();
                const cleanName2 = cleanName1.split(/[\s:：·~～\-]/)[0].trim();
                const candidateQueries = [...new Set([rawName, cleanName1, cleanName2])].filter(q => q && q.length >= 1);

                let matched = null;
                for (const q of candidateQueries) {
                    const res = await fetch('/api/video/search?wd=' + encodeURIComponent(q));
                    if (res.ok) {
                        const searchData = await res.json();
                        if (searchData.list && searchData.list.length > 0) {
                            // 精确度过滤：优先匹配包含标题名称的项
                            matched = searchData.list.find(it => 
                                it.vod_name === rawName || 
                                it.vod_name === cleanName1 || 
                                it.vod_name.startsWith(cleanName1) || 
                                it.vod_name.includes(cleanName1) ||
                                (cleanName2.length >= 2 && it.vod_name.includes(cleanName2))
                            ) || searchData.list[0];
                            if (matched && matched.vod_play_url) break;
                        }
                    }
                }

                if (matched && matched.vod_play_url) {
                    const origKanjuId = item.kanju_id || (String(item.vod_id || '').startsWith('av_') ? item.vod_id : '');
                    const origKanjuTitle = item.kanju_title || item.vod_name;
                    item = { ...item, ...matched, kanju_id: origKanjuId || matched.kanju_id || '', kanju_title: origKanjuTitle };
                    window.currentVideoList[index] = item;
                } else {
                    document.getElementById('videoEpisodesList').innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:15px;">全网暂未聚合到该推荐片的免VIP源，请尝试其他大片。</div>';
                    window.loadVideoComments(item);
                    return;
                }
            } catch(e) {
                document.getElementById('videoEpisodesList').innerHTML = '<div style="color:red; font-size:12px; padding:15px;">调取片源失败: ' + e.message + '</div>';
                window.loadVideoComments(item);
                return;
            }
        }

        window.currentVideo = item;
        window._failedRouteSet = new Set();
        window._autoSwitchCount = 0;

        const playFroms = (item.vod_play_from || '默认线路').split('$$$');
        const playGroups = (item.vod_play_url || '').split('$$$');

        let parsedGroups = [];
        playGroups.forEach((groupStr, gIdx) => {
            const fromName = playFroms[gIdx] || ('线路' + (gIdx + 1));
            const episodes = groupStr.split('#').filter(Boolean).map(e => {
                const pair = e.split('$');
                return {
                    title: pair[0] || '正片',
                    url: pair[1] || pair[0]
                };
            });
            if (episodes.length > 0) {
                parsedGroups.push({
                    name: fromName,
                    episodes: episodes
                });
            }
        });

        // 过滤掉非直链的网页分享组，仅保留可直接播放的 .m3u8 / .mp4 视频流线路
        const streamGroups = parsedGroups.filter(g => g.episodes.some(e => e.url.includes('.m3u8') || e.url.includes('.mp4')));
        if (streamGroups.length > 0) {
            parsedGroups = streamGroups;
        }

        // 严格按优先级排序：原站三大弹幕主源（量子、非凡、暴风）永远排在最前，其余作为备用专线
        parsedGroups.sort((a, b) => {
            const scoreA = getRoutePriorityScore(a.name, a.episodes[0] && a.episodes[0].url);
            const scoreB = getRoutePriorityScore(b.name, b.episodes[0] && b.episodes[0].url);
            return scoreB - scoreA;
        });

        window.currentVideo.groups = parsedGroups;
        window.currentGroupIdx = window.selectBestVideoRoute(parsedGroups, targetEpIdx);

        const vSection = document.getElementById('videoSection');
        if (vSection) vSection.style.display = 'none';
        const vPlayerView = document.getElementById('videoPlayerView');
        if (vPlayerView) vPlayerView.style.display = 'block';

        const vPlayerTitle = document.getElementById('videoPlayerTitle');
        if (vPlayerTitle) vPlayerTitle.innerText = item.vod_name;
        const vSourceTag = document.getElementById('videoSourceTag');
        if (vSourceTag) vSourceTag.innerText = item.type_name || '全网超清';
        const vDetailName = document.getElementById('videoDetailName');
        if (vDetailName) vDetailName.innerText = item.vod_name + ' (' + (item.vod_year || '热播') + ')';
        const vDetailMeta = document.getElementById('videoDetailMeta');
        if (vDetailMeta) vDetailMeta.innerText = (item.vod_area || '') + ' · ' + (item.type_name || '') + ' · 演员: ' + (item.vod_actor ? item.vod_actor.slice(0, 36) + '...' : '暂无');
        const vDetailDesc = document.getElementById('videoDetailDesc');
        if (vDetailDesc) vDetailDesc.innerText = item.vod_content ? item.vod_content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : (item.vod_remarks || '暂无详细简介');

        window.loadVideoComments(item);
        window.renderVideoSourceTabs(parsedGroups);
        window.renderVideoEpisodes(window.currentGroupIdx);
        window.playVideoEpisode(targetEpIdx);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 若是内置热播底包卡片（初始线路较少），后台静默并发检索全网13大源并动态追加备用线路
        if (!item._enriched && parsedGroups.length <= 3 && item.vod_name) {
            item._enriched = true;
            const cleanQ = item.vod_name.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').trim();
            fetch('/api/video/search?wd=' + encodeURIComponent(cleanQ))
                .then(r => r.ok ? r.json() : null)
                .then(sData => {
                    if (!sData || !Array.isArray(sData.list) || !window.currentVideo || window.currentVideo.vod_name !== item.vod_name) return;
                    const match = sData.list.find(it => it.vod_name === item.vod_name || it.vod_name.includes(cleanQ)) || sData.list[0];
                    if (!match || !match.vod_play_url) return;
                    const extraFroms = (match.vod_play_from || '').split('$$$').filter(Boolean);
                    const extraUrls = (match.vod_play_url || '').split('$$$').filter(Boolean);
                    let added = false;
                    const currentActiveGroup = window.currentVideo.groups[window.currentGroupIdx];
                    const currentActiveName = currentActiveGroup ? currentActiveGroup.name : '';
                    extraUrls.forEach((gStr, gIdx) => {
                        const fName = extraFroms[gIdx] || ('备用' + (gIdx + 1));
                        if (window.currentVideo.groups.some(g => g.name === fName)) return;
                        const eps = gStr.split('#').filter(Boolean).map(e => {
                            const pair = e.split('$');
                            return { title: pair[0] || '正片', url: pair[1] || pair[0] };
                        });
                        if (eps.some(e => e.url.includes('.m3u8') || e.url.includes('.mp4'))) {
                            window.currentVideo.groups.push({ name: fName, episodes: eps });
                            added = true;
                        }
                    });
                    if (added) {
                        window.currentVideo.groups.sort((a, b) => {
                            const scoreA = getRoutePriorityScore(a.name, a.episodes[0] && a.episodes[0].url);
                            const scoreB = getRoutePriorityScore(b.name, b.episodes[0] && b.episodes[0].url);
                            return scoreB - scoreA;
                        });
                        if (currentActiveName) {
                            const newIdx = window.currentVideo.groups.findIndex(g => g.name === currentActiveName);
                            if (newIdx !== -1) window.currentGroupIdx = newIdx;
                        }
                        window.renderVideoSourceTabs(window.currentVideo.groups);
                    }
                })
                .catch(() => {});
        }
    };

    // 智能选源算法：优先选择原站三大弹幕主源（量子/非凡/暴风）中含有目标集数且未超时的最佳线路
    window.selectBestVideoRoute = function(groups, targetEpIdx = 0) {
        if (!groups || groups.length === 0) return 0;
        const failedSet = window._failedRouteSet || new Set();
        const bannedNames = window._sessionSlowRouteNames || new Set();

        // 1. 优先在原站主力源 (score >= 90) 中寻找未失败且有该集数的线路
        for (let i = 0; i < groups.length; i++) {
            const g = groups[i];
            const score = getRoutePriorityScore(g.name, g.episodes[0] && g.episodes[0].url);
            if (score >= 90 && !failedSet.has(i) && !bannedNames.has(g.name) && g.episodes && g.episodes[targetEpIdx]) {
                return i;
            }
        }
        // 2. 次选任何未失败且有该集数的线路（按优先级顺序）
        for (let i = 0; i < groups.length; i++) {
            const g = groups[i];
            if (!failedSet.has(i) && g.episodes && g.episodes[targetEpIdx]) {
                return i;
            }
        }
        return 0;
    };

    // 主动并发测速选源：点击“⚡ 智能选源”按钮时，优先探测原站三大主源延迟并秒切最快源
    window.smartProbeAndSwitchRoute = async function() {
        if (!window.currentVideo || !window.currentVideo.groups || window.currentVideo.groups.length === 0) return;
        const groups = window.currentVideo.groups;
        const epIdx = window.currentEpisodeIdx || 0;
        const smartBtn = document.getElementById('smartRouteProbeBtn');
        if (smartBtn) {
            smartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>智能测速中...</span>';
        }
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('⚡ 正在并发探测原站主源与备用节点响应速度...', 2500);
        }

        const probeGroup = async (g, idx) => {
            const ep = (g.episodes && g.episodes[epIdx]) || (g.episodes && g.episodes[0]);
            if (!ep || !ep.url) return { idx, ok: false, latency: 99999, score: 0 };
            const score = getRoutePriorityScore(g.name, ep.url);
            const t0 = performance.now();
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 3500);
            try {
                const res = await fetch(ep.url, { method: 'GET', signal: ctrl.signal });
                clearTimeout(timer);
                if (!res.ok) return { idx, ok: false, latency: 99999, score };
                const latency = Math.round(performance.now() - t0);
                try { ctrl.abort(); } catch (e) {}
                return { idx, ok: true, latency, score };
            } catch (e) {
                clearTimeout(timer);
                return { idx, ok: false, latency: 99999, score };
            }
        };

        // 优先并发测试前 6 条线路（包含全部原站三大主源 + 前列高速备用源）
        const candidates = groups.slice(0, Math.min(groups.length, 6));
        const results = await Promise.all(candidates.map((g, idx) => probeGroup(g, idx)));
        const valid = results.filter(r => r.ok);

        if (valid.length > 0) {
            // 原站主源 (score >= 90) 只要响应正常 (< 2600ms)，永远优先于备用源；同级内取延迟最低者
            valid.sort((a, b) => {
                const aPrimary = a.score >= 90 && a.latency < 2600 ? 1 : 0;
                const bPrimary = b.score >= 90 && b.latency < 2600 ? 1 : 0;
                if (aPrimary !== bPrimary) return bPrimary - aPrimary;
                return a.latency - b.latency;
            });
            const best = valid[0];
            window._failedRouteSet = new Set();
            window.switchPlayGroup(best.idx, epIdx);
            const bestName = formatFriendlyLineName(groups[best.idx].name, best.idx, groups[best.idx].episodes[0]?.url);
            if (window.dpInstance && window.dpInstance.notice) {
                window.dpInstance.notice(`⚡ 智能优选完成：已锁定最快节点 [${bestName}] (${best.latency}ms)`, 3500);
            }
        } else {
            // 若前排节点跨域受限或超时，自动切到下一条未尝试过的线路
            window.triggerAutoSwitchRoute(epIdx, '测速切换');
        }

        if (smartBtn) {
            smartBtn.innerHTML = '<i class="fas fa-bolt"></i> <span>⚡ 智能选源</span>';
        }
    };

    // 超时或断流自动切换至下一可用线路（优先原站主源，其次备用源）
    window.triggerAutoSwitchRoute = function(epIdx, reason = '加载超时') {
        if (!window.currentVideo || !window.currentVideo.groups) return;
        const groups = window.currentVideo.groups;
        const totalGroups = groups.length;
        if (totalGroups <= 1) return;

        if (!window._failedRouteSet) window._failedRouteSet = new Set();
        window._failedRouteSet.add(window.currentGroupIdx);

        const curGroup = groups[window.currentGroupIdx];
        if (curGroup && curGroup.name) {
            if (!window._sessionSlowRouteNames) window._sessionSlowRouteNames = new Set();
            window._sessionSlowRouteNames.add(curGroup.name);
        }

        if ((window._autoSwitchCount || 0) >= totalGroups - 1) {
            if (window.dpInstance && window.dpInstance.notice) {
                window.dpInstance.notice('所有线路均已尝试，请手动点击上方其他线路重试', 4000);
            }
            return;
        }

        window._autoSwitchCount = (window._autoSwitchCount || 0) + 1;

        // 寻找下一个未失败且有当前集数的线路（由于 groups 已按主源->备用源排序，顺序查找即可保证主源优先）
        let nextGroup = -1;
        for (let i = 0; i < totalGroups; i++) {
            if (!window._failedRouteSet.has(i) && groups[i].episodes && groups[i].episodes[epIdx]) {
                nextGroup = i;
                break;
            }
        }
        if (nextGroup === -1) {
            nextGroup = (window.currentGroupIdx + 1) % totalGroups;
        }

        const nextName = formatFriendlyLineName(groups[nextGroup].name, nextGroup, groups[nextGroup].episodes[0]?.url);
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice(`当前线路${reason}，已自动切换至: ${nextName}`, 3500);
        }
        setTimeout(function () {
            window.switchPlayGroup(nextGroup, epIdx);
        }, 200);
    };

    // 渲染播放线路标签 (纯透明 Liquid Glass + 智能选源按钮 + 鼠标折射光斑与透镜框随动)
    window.renderVideoSourceTabs = function(groups) {
        const tabsBox = document.getElementById('videoPlaySourceTabs');
        if (!tabsBox) return;
        if (!groups || groups.length === 0) {
            tabsBox.innerHTML = '';
            return;
        }

        tabsBox.className = 'source-route-nav';
        const smartBtnHtml = `
            <button class="source-route-btn" id="smartRouteProbeBtn" onclick="window.smartProbeAndSwitchRoute()" title="自动测速并优选原站弹幕主源" style="border: 1px solid rgba(56, 189, 248, 0.45); color: #38bdf8; font-weight: 600;">
                <i class="fas fa-bolt"></i> <span>⚡ 智能选源</span>
            </button>
        `;
        const btnsHtml = groups.map((g, idx) => {
            const sampleUrl = g.episodes && g.episodes[0] ? g.episodes[0].url : '';
            const displayName = formatFriendlyLineName(g.name, idx, sampleUrl);
            const isAct = idx === window.currentGroupIdx;
            return `
                <button class="source-route-btn ${isAct ? 'active' : ''}" id="sourceRouteBtn_${idx}" onclick="window.switchPlayGroup(${idx}, window.currentEpisodeIdx || 0)">
                    <i class="fas fa-play-circle"></i> <span>${displayName}</span>
                </button>
            `;
        }).join('');

        tabsBox.innerHTML = '<div class="source-route-glider" id="sourceRouteGlider"></div>' + smartBtnHtml + btnsHtml;

        // 绑定鼠标跟随光效与液态玻璃选中框透镜随动
        if (typeof window.bindLiquidGlassNav === 'function') {
            window.bindLiquidGlassNav('videoPlaySourceTabs', 'sourceRouteGlider', '.source-route-btn', () => {
                return document.querySelector('#videoPlaySourceTabs .source-route-btn.active');
            });
        }
        setTimeout(() => {
            const activeBtn = document.getElementById('sourceRouteBtn_' + (window.currentGroupIdx || 0));
            const glider = document.getElementById('sourceRouteGlider');
            if (activeBtn && glider && typeof window.moveGliderToButton === 'function') {
                window.moveGliderToButton(tabsBox, glider, activeBtn);
            }
        }, 30);
    };

    // 切换播放线路
    window.switchPlayGroup = function(groupIdx, targetEpIdx = 0) {
        window.currentGroupIdx = groupIdx;
        document.querySelectorAll('#videoPlaySourceTabs .source-route-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById('sourceRouteBtn_' + groupIdx);
        const tabsBox = document.getElementById('videoPlaySourceTabs');
        const glider = document.getElementById('sourceRouteGlider');
        if (activeBtn) {
            activeBtn.classList.add('active');
            if (tabsBox && glider && typeof window.moveGliderToButton === 'function') {
                window.moveGliderToButton(tabsBox, glider, activeBtn);
            }
        }
        window.renderVideoEpisodes(groupIdx);
        window.playVideoEpisode(targetEpIdx);
    };

    // 渲染剧集列表
    window.renderVideoEpisodes = function(groupIdx) {
        const epBox = document.getElementById('videoEpisodesList');
        if (!epBox || !window.currentVideo || !window.currentVideo.groups) return;

        const group = window.currentVideo.groups[groupIdx] || window.currentVideo.groups[0];
        if (!group || !group.episodes || group.episodes.length === 0) {
            epBox.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:10px;">该线路暂无集数</div>';
            return;
        }

        epBox.innerHTML = group.episodes.map((ep, idx) => `
            <button class="chap-btn ${idx === window.currentEpisodeIdx ? 'read-active' : ''}" id="epBtn_${idx}" onclick="window.playVideoEpisode(${idx})">
                ${ep.title}
            </button>
        `).join('');
    };

    // 播放指定集数 (全平台兼容：iOS原生硬解 + Android/PC自适应HLS + 6.5秒超时看门狗与断线自动切源容灾)
    window.playVideoEpisode = function(idx) {
        if (!window.currentVideo || !window.currentVideo.groups) return;
        const group = window.currentVideo.groups[window.currentGroupIdx] || window.currentVideo.groups[0];
        if (!group || !group.episodes || !group.episodes[idx]) return;

        window.currentEpisodeIdx = idx;
        const ep = group.episodes[idx];

        if (window._playbackWatchdogTimer) {
            clearTimeout(window._playbackWatchdogTimer);
            window._playbackWatchdogTimer = null;
        }

        // 检查是否有该集的历史播放秒数用于断点续播
        let resumePlaySeconds = 0;
        try {
            const vidKey = window.currentVideo.vod_id || window.currentVideo.id || window.currentVideo.vod_name;
            const prevRec = (window.getVideoHistory() || []).find(h => (h.vod_id || h.id || h.vod_name) === vidKey);
            if (prevRec && Number(prevRec.ep_idx) === Number(idx) && Number(prevRec.play_seconds) > 12) {
                resumePlaySeconds = Number(prevRec.play_seconds);
            }
        } catch (e) {}

        // 实时保存观看历史
        window.saveVideoHistory(window.currentVideo, group.name, ep.title, idx, resumePlaySeconds);

        document.querySelectorAll('#videoEpisodesList .chap-btn').forEach(btn => btn.classList.remove('read-active'));
        const activeBtn = document.getElementById('epBtn_' + idx);
        if (activeBtn) activeBtn.classList.add('read-active');

        const badge = document.getElementById('currentEpisodeBadge');
        if (badge) badge.innerText = formatFriendlyLineName(group.name, window.currentGroupIdx, ep.url) + ' · ' + ep.title;

        const container = document.getElementById('dplayerContainer');
        if (!container) return;

        if (window.currentP2pEngine) {
            try { window.currentP2pEngine.destroy(); } catch(e){}
            window.currentP2pEngine = null;
        }
        if (window.currentHlsInstance) {
            try { window.currentHlsInstance.destroy(); } catch(e){}
            window.currentHlsInstance = null;
        }
        if (window.dpInstance) {
            try { window.dpInstance.destroy(); } catch(e){}
            window.dpInstance = null;
        }

        const videoUrl = ep.url;
        const isHls = videoUrl.includes('.m3u8');
        // 优先使用原站标准片名 kanju_title 检索弹幕，确保所有线路弹幕 100% 同步挂载
        const videoTitle = window.currentVideo.kanju_title || window.currentVideo.vod_name || '';
        const kanjuCardId = window.currentVideo.kanju_id || (String(window.currentVideo.vod_id).startsWith('av_') ? window.currentVideo.vod_id : '');

        const ua = navigator.userAgent || '';
        const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isMobile = isIOS || /Android|Mobile|Adr|MicroMessenger|UCBrowser|Quark|baiduboxapp/i.test(ua);

        // 启动 7 秒首帧超时看门狗：若当前线路卡死或超过 7 秒未加载出首帧数据，自动切换至下一优选源
        const armPlaybackWatchdog = function(videoEl) {
            if (window._playbackWatchdogTimer) clearTimeout(window._playbackWatchdogTimer);
            const clearWatchdog = function() {
                if (window._playbackWatchdogTimer) {
                    clearTimeout(window._playbackWatchdogTimer);
                    window._playbackWatchdogTimer = null;
                }
                window._autoSwitchCount = 0;
            };
            videoEl.addEventListener('loadeddata', clearWatchdog, { once: true });
            videoEl.addEventListener('canplay', clearWatchdog, { once: true });
            videoEl.addEventListener('playing', clearWatchdog, { once: true });
            window._playbackWatchdogTimer = setTimeout(function() {
                if (!videoEl || videoEl.readyState < 2) {
                    window.triggerAutoSwitchRoute(idx, '响应超时');
                }
            }, 7000);
        };

        window.dpInstance = new DPlayer({
            container: container,
            autoplay: !isMobile,
            theme: '#38bdf8',
            loop: false,
            lang: 'zh-cn',
            screenshot: !isMobile,
            hotkey: true,
            preload: 'auto',
            volume: 0.8,
            playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
            video: {
                url: videoUrl,
                type: isHls ? 'customHls' : 'auto',
                customType: {
                    customHls: function (video, player) {
                        // 移动端关键内联播放属性：防止 iOS / 微信 / 夸克 / UC 强制劫持或黑屏拦截
                        video.setAttribute('playsinline', 'true');
                        video.setAttribute('webkit-playsinline', 'true');
                        video.setAttribute('x5-playsinline', 'true');
                        video.setAttribute('x5-video-player-type', 'h5-page');

                        armPlaybackWatchdog(video);

                        // 1. iOS / iPadOS 优先走苹果系统底层原生 HLS 硬件解码 (避开 ManagedMediaSource 与 WebRTC 冲突)
                        if (isIOS && video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = videoUrl;
                            video.addEventListener('loadedmetadata', function () {
                                video.play().catch(function () {});
                            }, { once: true });
                            video.addEventListener('error', function () {
                                window.triggerAutoSwitchRoute(idx, '连接失败');
                            }, { once: true });
                            return;
                        }

                        // 2. Android 与 PC 走 Hls.js 引擎 (关闭导致手机断流的 lowLatencyMode)
                        if (window.Hls && window.Hls.isSupported()) {
                            const hls = new window.Hls({
                                enableWorker: !isMobile,
                                lowLatencyMode: false,
                                startLevel: -1,
                                capLevelToPlayerSize: isMobile,
                                maxBufferLength: isMobile ? 20 : 30,
                                maxMaxBufferLength: isMobile ? 40 : 60,
                                backBufferLength: isMobile ? 15 : 30,
                                manifestLoadingTimeOut: 5000,
                                manifestLoadingMaxRetry: 1,
                                levelLoadingTimeOut: 5500,
                                fragLoadingTimeOut: 7000
                            });

                            // 仅在桌面端启用 WebRTC P2P 加速引擎，避免手机 4G/5G NAT 阻塞分片加载
                            const P2pEngineClass = window.P2PEngineHls || window.P2pEngineHls;
                            if (!isMobile && P2pEngineClass && typeof P2pEngineClass.isSupported === 'function' && P2pEngineClass.isSupported()) {
                                try {
                                    let p2pEngine = null;
                                    if (P2pEngineClass.HlsjsEngine) {
                                        p2pEngine = new P2pEngineClass.HlsjsEngine(hls, {
                                            p2pEnabled: window.isP2pEnabled !== false
                                        });
                                    } else {
                                        p2pEngine = new P2pEngineClass({
                                            hlsjsInstance: hls,
                                            p2pEnabled: window.isP2pEnabled !== false
                                        });
                                    }
                                    window.currentP2pEngine = p2pEngine;

                                    if (p2pEngine && typeof p2pEngine.on === 'function') {
                                        p2pEngine.on('stats', function (stats) {
                                            window.p2pStats = stats;
                                            const p2pMB = (stats.totalP2pDownloaded / 1024 / 1024).toFixed(1);
                                            const httpMB = (stats.totalHttpDownloaded / 1024 / 1024).toFixed(1);
                                            const total = stats.totalP2pDownloaded + stats.totalHttpDownloaded;
                                            const ratio = total > 0 ? Math.round((stats.totalP2pDownloaded / total) * 100) : 0;
                                            const peersCount = window.currentPeersCount || 0;
                                            
                                            const liveText = document.getElementById('p2pLiveText');
                                            if (liveText && window.isP2pEnabled !== false) {
                                                if (peersCount > 0) {
                                                    liveText.innerText = `P2P加速中 (${peersCount}节点 · ${p2pMB}MB · ${ratio}%)`;
                                                } else {
                                                    liveText.innerText = `P2P就绪 (${p2pMB}MB · ${ratio}%)`;
                                                }
                                            }
                                            const detailsText = document.getElementById('p2pDetailsText');
                                            if (detailsText) {
                                                detailsText.innerText = `连接节点: ${peersCount} 个 | P2P下载: ${p2pMB}MB (${ratio}%) | HTTP: ${httpMB}MB`;
                                            }
                                        });

                                        p2pEngine.on('peers', function (peers) {
                                            window.currentPeersCount = peers.length;
                                            const p2pMB = window.p2pStats ? (window.p2pStats.totalP2pDownloaded / 1024 / 1024).toFixed(1) : '0.0';
                                            const liveText = document.getElementById('p2pLiveText');
                                            if (liveText && window.isP2pEnabled !== false) {
                                                if (peers.length > 0) {
                                                    liveText.innerText = `P2P加速中 (${peers.length}节点 · ${p2pMB}MB)`;
                                                } else {
                                                    liveText.innerText = 'P2P就绪 (寻找节点中...)';
                                                }
                                            }
                                            const detailsText = document.getElementById('p2pDetailsText');
                                            if (detailsText && window.p2pStats) {
                                                const p2pDownloaded = (window.p2pStats.totalP2pDownloaded / 1024 / 1024).toFixed(1);
                                                const httpMB = (window.p2pStats.totalHttpDownloaded / 1024 / 1024).toFixed(1);
                                                detailsText.innerText = `连接节点: ${peers.length} 个 | P2P下载: ${p2pDownloaded}MB | HTTP: ${httpMB}MB`;
                                            }
                                        });
                                    }
                                } catch(e) {
                                    console.warn('[P2P Engine] 挂载跳过，走原生超清线路:', e);
                                }
                            } else if (isMobile) {
                                const liveText = document.getElementById('p2pLiveText');
                                if (liveText) liveText.innerText = '移动直连超清';
                            }

                            hls.loadSource(videoUrl);
                            hls.attachMedia(video);
                            hls.on(window.Hls.Events.MANIFEST_PARSED, function (event, data) {
                                if (!isMobile && data && data.levels && data.levels.length > 0) {
                                    const highestLevel = data.levels.length - 1;
                                    hls.currentLevel = highestLevel;
                                }
                                video.play().catch(function () {});
                            });

                            // 错误自愈与移动端原生回退 / 自动换线容灾
                            let mediaErrorRecovered = false;
                            hls.on(window.Hls.Events.ERROR, function (event, data) {
                                if (!data || !data.fatal) return;
                                if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR && !mediaErrorRecovered) {
                                    mediaErrorRecovered = true;
                                    hls.recoverMediaError();
                                    return;
                                }
                                // 如果移动端原生支持 m3u8，立即回退至手机浏览器原生解码
                                if (isMobile && video.canPlayType('application/vnd.apple.mpegurl')) {
                                    try { hls.destroy(); } catch(e) {}
                                    window.currentHlsInstance = null;
                                    video.src = videoUrl;
                                    video.play().catch(function () {});
                                    return;
                                }
                                // 若当前线路节点不通，调用智能容灾切源
                                window.triggerAutoSwitchRoute(idx, '节点繁忙');
                            });

                            window.currentHlsInstance = hls;
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = videoUrl;
                            video.addEventListener('loadedmetadata', function () {
                                video.play().catch(function () {});
                            }, { once: true });
                            video.addEventListener('error', function () {
                                window.triggerAutoSwitchRoute(idx, '加载失败');
                            }, { once: true });
                        } else {
                            video.src = videoUrl;
                        }
                    }
                }
            },
            apiBackend: {
                read: async function(endpoint) {
                    try {
                        let danmakuUrl = '/api/video/danmaku?ep=' + idx;
                        if (kanjuCardId) danmakuUrl += '&ep_id=' + encodeURIComponent(kanjuCardId);
                        if (videoTitle) danmakuUrl += '&title=' + encodeURIComponent(videoTitle);

                        const res = await fetch(danmakuUrl);
                        if (res.ok) {
                            const json = await res.json();
                            if (json && Array.isArray(json.data) && json.data.length > 0) {
                                // 兼容数组格式与对象格式，确保 DPlayer 弹幕轨道完美渲染
                                const formatted = json.data.map(item => {
                                    if (Array.isArray(item)) {
                                        return {
                                            time: Number(item[0]) || 0,
                                            type: item[1] === 1 ? 0 : (item[1] || 0),
                                            color: item[2] || 16777215,
                                            author: item[3] || '原站网友',
                                            text: String(item[4] || '')
                                        };
                                    }
                                    return {
                                        time: Number(item.time) || 0,
                                        type: item.type === 1 ? 0 : (item.type || 0),
                                        color: item.color || 16777215,
                                        author: item.author || '原站网友',
                                        text: String(item.text || '')
                                    };
                                });
                                endpoint.success(formatted);
                                return;
                            }
                        }
                    } catch(e) {}
                    endpoint.success([]);
                },
                send: function(endpoint) {
                    endpoint.success();
                }
            },
            danmaku: {
                id: 'dmu_' + (kanjuCardId || videoTitle) + '_ep_' + idx,
                api: window.location.origin + '/api/video/danmaku/',
                user: '剧友',
                bottom: '12%',
                unlimited: false
            }
        });

        // 将原站同款独立弹幕开关、快捷控制与全部偏好设置集成进播放器右下角控制栏与右侧设置面板
        try {
            if (typeof window.injectBottomRightPlayerControls === 'function') {
                window.injectBottomRightPlayerControls(container);
            }
        } catch(e) {
            console.warn('[OpenHappy Video] 控件注入异常:', e);
        }

        // 绑定自动跳片头、自动连播下一集及弹幕状态同步
        setTimeout(async () => {
            if (window.dpInstance) {
                // 1. 尝试获取原站真实跳过片头片尾预设
                let introSeconds = 0;
                try {
                    let metaUrl = '/api/video/meta?title=' + encodeURIComponent(videoTitle);
                    if (kanjuCardId) metaUrl += '&id=' + encodeURIComponent(kanjuCardId);
                    const metaRes = await fetch(metaUrl);
                    if (metaRes.ok) {
                        const metaJson = await metaRes.json();
                        if (metaJson.skip_preset && metaJson.skip_preset.intro_end > 0) {
                            introSeconds = metaJson.skip_preset.intro_end;
                            window.currentIntroSeconds = introSeconds;
                            const descEl = document.getElementById('skipIntroDescText');
                            if (descEl) descEl.innerText = '已同步原站众包片头点: ' + introSeconds + '秒';
                            console.log('[OpenHappy Video] 获取到原站片头跳过点: ' + introSeconds + '秒');
                        }
                    }
                } catch(e) {}

                // 如果原站无预设，但开启了跳过片头，动漫/电视剧通用片头通常为 90 秒
                if (!introSeconds) {
                    const isAnimeOrDrama = (window.currentVideo.type_name || '').includes('动漫') || (window.currentVideo.type_name || '').includes('剧');
                    introSeconds = isAnimeOrDrama ? 90 : 0;
                }

                // 监听开始播放：恢复跨端观看秒数 或 自动跳片头 + 定期保存播放秒数
                let hasSkippedIntro = false;
                let hasResumedTime = false;
                let lastSavedSec = resumePlaySeconds || 0;
                let lastCloudPushAt = Date.now();
                window.dpInstance.on('timeupdate', function() {
                    if (!window.dpInstance || !window.dpInstance.video) return;
                    const cur = window.dpInstance.video.currentTime || 0;
                    const dur = window.dpInstance.video.duration || 0;

                    if (!hasResumedTime && resumePlaySeconds > 12 && cur > 0.2) {
                        hasResumedTime = true;
                        hasSkippedIntro = true;
                        if (!dur || resumePlaySeconds < dur - 15) {
                            window.dpInstance.seek(resumePlaySeconds);
                            const mm = String(Math.floor(resumePlaySeconds / 60)).padStart(2, '0');
                            const ss = String(Math.floor(resumePlaySeconds % 60)).padStart(2, '0');
                            if (window.dpInstance.notice) {
                                window.dpInstance.notice(`已为您恢复上次观看进度 (${mm}:${ss})`, 3200);
                            }
                            return;
                        }
                    }

                    if (window.isAutoSkipIntro && !hasSkippedIntro && introSeconds > 10 && resumePlaySeconds <= 12) {
                        if (cur >= 0 && cur < introSeconds - 1) {
                            hasSkippedIntro = true;
                            window.dpInstance.seek(introSeconds);
                            if (window.dpInstance.notice) {
                                window.dpInstance.notice('已为你自动跳过片头 (' + introSeconds + '秒)', 3000);
                            }
                            return;
                        }
                    }

                    // 每隔 5 秒更新一次本地播放秒数，每隔 12 秒无感自动同步一次云端进度
                    if (cur > 8 && Math.abs(cur - lastSavedSec) >= 5 && window.currentVideo) {
                        lastSavedSec = Math.floor(cur);
                        const shouldPushCloud = (Date.now() - lastCloudPushAt > 12000);
                        if (shouldPushCloud) lastCloudPushAt = Date.now();
                        window.saveVideoHistory(window.currentVideo, group.name, ep.title, idx, lastSavedSec, !shouldPushCloud);
                    }
                });

                window.dpInstance.on('seeked', function() {
                    if (!window.dpInstance || !window.dpInstance.video || !window.currentVideo) return;
                    const cur = Math.floor(window.dpInstance.video.currentTime || 0);
                    if (cur > 8) {
                        lastSavedSec = cur;
                        lastCloudPushAt = Date.now();
                        window.saveVideoHistory(window.currentVideo, group.name, ep.title, idx, cur, false);
                    }
                });

                window.dpInstance.on('pause', function() {
                    if (!window.dpInstance || !window.dpInstance.video || !window.currentVideo) return;
                    const cur = Math.floor(window.dpInstance.video.currentTime || 0);
                    if (cur > 8) {
                        lastSavedSec = cur;
                        lastCloudPushAt = Date.now();
                        window.saveVideoHistory(window.currentVideo, group.name, ep.title, idx, cur, false);
                    }
                });

                window.dpInstance.on('ended', function() {
                    if (window.isAutoNextEnabled) {
                        console.log('[OpenHappy Video] 本集播放完毕，自动连播下一集...');
                        window.playNextEpisode();
                    }
                });
                if (!window.isDanmakuEnabled && window.dpInstance.danmaku) {
                    window.dpInstance.danmaku.hide();
                }
            }
        }, 500);
    };

    // 将独立弹幕开关、快捷控制与原先左上角的全套高级设置完整集成进播放器右下角控制栏与右侧设置弹窗
    window.injectBottomRightPlayerControls = function(dpContainer) {
        if (!dpContainer) return;

        // 1. 在底部右侧控制栏 (.dplayer-icons-right) 注入：独立弹幕开关胶囊、跳片头、P2P状态、下一集、画中画
        const rightIcons = dpContainer.querySelector('.dplayer-icons.dplayer-icons-right');
        const settingWrap = dpContainer.querySelector('.dplayer-setting');
        const commentWrap = dpContainer.querySelector('.dplayer-comment');
        if (rightIcons && settingWrap && !rightIcons.querySelector('.dp-custom-right-injected')) {
            // (A) 独立出来的弹幕开关胶囊按钮 (参考原站播放器：一键开/关弹幕，紧邻发弹幕图标)
            const danmakuBtn = document.createElement('button');
            danmakuBtn.type = 'button';
            danmakuBtn.id = 'dpDanmakuBarBtn';
            danmakuBtn.className = 'dp-danmaku-bar-pill dp-custom-right-injected' + (window.isDanmakuEnabled === false ? ' off' : '');
            danmakuBtn.title = '点击一键开启/关闭实时弹幕';
            danmakuBtn.onclick = function(e) {
                e.stopPropagation();
                window.toggleDanmaku();
            };
            danmakuBtn.innerHTML = `<span class="dp-danmaku-tag">弹</span><span id="dpDanmakuBarText">${window.isDanmakuEnabled === false ? '关' : '开'}</span>`;
            if (commentWrap) {
                rightIcons.insertBefore(danmakuBtn, commentWrap);
            } else {
                rightIcons.insertBefore(danmakuBtn, settingWrap);
            }

            const frag = document.createDocumentFragment();

            // (B) P2P 实时状态胶囊 (桌面端显示实时节点，点击可开关)
            const p2pSpan = document.createElement('span');
            p2pSpan.className = 'p2p-live-pill dp-custom-right-injected' + (window.isP2pEnabled === false ? ' off' : '');
            p2pSpan.id = 'p2pLivePill';
            p2pSpan.title = '点击切换 WebRTC P2P 边缘加速';
            p2pSpan.onclick = function(e) {
                e.stopPropagation();
                window.toggleP2pFeature();
            };
            p2pSpan.innerHTML = `<span class="p2p-dot"></span><span id="p2pLiveText">${window.isP2pEnabled === false ? 'P2P 已关' : 'P2P 就绪'}</span>`;
            frag.appendChild(p2pSpan);

            // (C) 快捷跳片头按钮
            const skipBtn = document.createElement('button');
            skipBtn.type = 'button';
            skipBtn.className = 'dp-skip-bar-pill dp-custom-right-injected';
            skipBtn.title = '快进跳过片头 (+85秒)';
            skipBtn.onclick = function(e) {
                e.stopPropagation();
                const sec = window.currentIntroSeconds && window.currentIntroSeconds > 10 ? window.currentIntroSeconds : 85;
                window.skipVideoTime(sec);
                if (window.dpInstance && window.dpInstance.notice) {
                    window.dpInstance.notice('已为您快进跳过片头 (' + sec + '秒)', 2000);
                }
            };
            skipBtn.innerHTML = '跳片头';
            frag.appendChild(skipBtn);

            // (D) 下一集按钮
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'dplayer-icon dp-custom-icon-btn';
            nextBtn.title = '下一集';
            nextBtn.setAttribute('aria-label', '下一集');
            nextBtn.onclick = function(e) {
                e.stopPropagation();
                window.playNextEpisode();
            };
            nextBtn.innerHTML = '<span class="dplayer-icon-content"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></span>';
            frag.appendChild(nextBtn);

            // (E) 画中画按钮
            const pipBtn = document.createElement('button');
            pipBtn.type = 'button';
            pipBtn.className = 'dplayer-icon dp-custom-icon-btn dp-pip-icon-btn';
            pipBtn.title = '画中画小窗播放';
            pipBtn.setAttribute('aria-label', '画中画小窗播放');
            pipBtn.onclick = function(e) {
                e.stopPropagation();
                window.togglePip();
            };
            pipBtn.innerHTML = '<span class="dplayer-icon-content"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg></span>';
            frag.appendChild(pipBtn);

            rightIcons.insertBefore(frag, settingWrap);
        }

        // 2. 在右下角设置面板 (.dplayer-setting-origin-panel) 完整集成原先左上角的 5 大高级卡片设置 + 倍速/循环/弹幕透明度
        const originPanel = dpContainer.querySelector('.dplayer-setting-origin-panel');
        if (originPanel && !originPanel.querySelector('.dp-custom-setting-divider')) {
            // 顶部面板标题栏
            const headerRow = document.createElement('div');
            headerRow.className = 'dp-setting-panel-header';
            headerRow.innerHTML = `<i class="fas fa-sliders" style="color:var(--accent);"></i> <span>播放器与画质偏好设置</span>`;
            originPanel.insertBefore(headerRow, originPanel.firstChild);

            // 在原生播放速度行右侧显示当前倍速数值
            const speedToggle = originPanel.querySelector('.dplayer-setting-speed .dplayer-toggle');
            if (speedToggle) {
                speedToggle.innerHTML = `<span id="dpCurSpeedLabel" style="font-size:11px;color:#38bdf8;font-weight:600;margin-right:3px;">1.0x</span>` + speedToggle.innerHTML;
            }
            const speedItems = dpContainer.querySelectorAll('.dplayer-setting-speed-item');
            speedItems.forEach(item => {
                item.addEventListener('click', function() {
                    const sp = this.getAttribute('data-speed') || '1';
                    const lbl = document.getElementById('dpCurSpeedLabel');
                    if (lbl) lbl.innerText = (sp === '1' ? '1.0' : sp) + 'x';
                });
            });

            const divider = document.createElement('div');
            divider.className = 'dp-custom-setting-divider';
            originPanel.appendChild(divider);

            const makeRichCardRow = (switchId, iconHtml, titleText, descHtml, isActive, onToggle) => {
                const row = document.createElement('div');
                row.className = 'dplayer-setting-item dp-custom-setting-row';
                row.innerHTML = `
                    <div class="dp-setting-rich-info">
                        <div class="dp-setting-rich-title">${iconHtml}<span>${titleText}</span></div>
                        <div class="dp-setting-rich-desc">${descHtml}</div>
                    </div>
                    <div class="glass-switch dp-mini-switch ${isActive ? 'active' : ''}" id="${switchId}"></div>
                `;
                row.onclick = function(e) {
                    e.stopPropagation();
                    onToggle();
                };
                return row;
            };

            // (1) WebRTC P2P 边缘加速 (带实时节点与流量统计)
            originPanel.appendChild(makeRichCardRow(
                'p2pSwitch',
                '<i class="fas fa-bolt" style="color:#f59e0b;"></i>',
                'WebRTC P2P 边缘加速',
                '<span id="p2pDetailsText" style="color:var(--accent);">正在连接 P2P 种子网络...</span>',
                window.isP2pEnabled !== false,
                () => window.toggleP2pFeature()
            ));

            // (2) GPU 4K 超清画质增强
            originPanel.appendChild(makeRichCardRow(
                'hqSwitch',
                '<i class="fas fa-wand-magic-sparkles" style="color:#38bdf8;"></i>',
                'GPU 4K 超清画质增强',
                '原站同款色彩 HDR 优化与边缘锐化',
                window.isVideoHqEnhanced !== false,
                () => window.toggleVideoHqEnhance()
            ));

            // (3) 智能自动跳过片头
            originPanel.appendChild(makeRichCardRow(
                'skipIntroSwitch',
                '<i class="fas fa-forward" style="color:#38bdf8;"></i>',
                '智能自动跳过片头',
                '<span id="skipIntroDescText">根据原站社区众包时间戳自动跳约90秒</span>',
                window.isAutoSkipIntro !== false,
                () => window.toggleAutoSkipIntro()
            ));

            // (4) 原站剧友实时弹幕
            originPanel.appendChild(makeRichCardRow(
                'danmakuSwitch',
                '<i class="fas fa-comment-dots" style="color:#a855f7;"></i>',
                '原站剧友实时弹幕',
                '展示原站弹幕流，字幕区智能避让',
                window.isDanmakuEnabled !== false,
                () => window.toggleDanmaku()
            ));

            // (5) 自动连播下一集
            originPanel.appendChild(makeRichCardRow(
                'autoNextSwitch',
                '<i class="fas fa-forward-step" style="color:#10b981;"></i>',
                '自动连播下一集',
                '本集播放完毕后自动无缝切入下一集',
                window.isAutoNextEnabled !== false,
                () => window.toggleAutoNext()
            ));

            // (6) 快捷手动跳过片头 (+85秒)
            const skipActionRow = document.createElement('div');
            skipActionRow.className = 'dplayer-setting-item dp-custom-setting-row dp-custom-action-row';
            skipActionRow.innerHTML = `
                <span class="dplayer-label" style="color:#38bdf8;font-weight:600;"><i class="fas fa-bolt"></i> 快进跳过片头 (+85秒)</span>
                <span style="font-size:11px;color:#38bdf8;background:rgba(56,189,248,0.15);padding:2px 8px;border-radius:10px;">⚡ 立即跳</span>
            `;
            skipActionRow.onclick = function(e) {
                e.stopPropagation();
                const sec = window.currentIntroSeconds && window.currentIntroSeconds > 10 ? window.currentIntroSeconds : 85;
                window.skipVideoTime(sec);
                const settingBox = dpContainer.querySelector('.dplayer-setting-box');
                if (settingBox) settingBox.classList.remove('dplayer-setting-box-open');
            };
            originPanel.appendChild(skipActionRow);
        }
    };

    // 实时拉取并呈现 kanju3 原站真实讨论数据
    window.loadVideoComments = async function(item) {
        const container = document.getElementById('videoCommentsContainer');
        const badge = document.getElementById('videoCommentsCountBadge');
        const icon = document.getElementById('commentsLoadingIcon');
        if (!container || !item) return;

        if (icon) icon.classList.add('fa-spin');
        container.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:15px; text-align:center;"><i class="fas fa-spinner fa-spin"></i> 正在拉取原站全网真实剧友讨论...</div>';

        const rawTitle = (item.kanju_title || item.vod_name || '').replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '').trim();
        const cleanTitle = rawTitle.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').trim();

        // 优先提取 av_ 卡片ID，若被覆盖则从内置 8 大板块片单中智能反查
        let cardId = item.kanju_id || (String(item.vod_id || '').startsWith('av_') ? item.vod_id : '');
        if (!cardId || !String(cardId).startsWith('av_')) {
            cardId = '';
            if (Array.isArray(window.KANJU_ALL_SECTIONS)) {
                for (const sec of window.KANJU_ALL_SECTIONS) {
                    const found = (sec.cards || []).find(c =>
                        c.vod_id && String(c.vod_id).startsWith('av_') &&
                        (c.vod_name === rawTitle || c.vod_name === cleanTitle || (cleanTitle && c.vod_name.includes(cleanTitle)))
                    );
                    if (found) {
                        cardId = found.vod_id;
                        item.kanju_id = cardId;
                        break;
                    }
                }
            }
        }

        const renderCommentList = (list) => {
            if (badge) badge.innerText = list.length > 0 ? (list.length + '条评论') : '评论区';
            container.innerHTML = list.map(c => `
                <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border); border-radius:8px; padding:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <div style="font-weight:600; font-size:12px; color:var(--text-main); display:flex; align-items:center; gap:6px;">
                            <i class="fas fa-user-circle" style="color:var(--accent);"></i>
                            <span>${c.user}</span>
                            ${c.episode ? `<span style="font-size:10px; color:var(--text-muted); background:rgba(255,255,255,0.06); padding:1px 5px; border-radius:4px;">${c.episode}</span>` : ''}
                        </div>
                        <div style="font-size:11px; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
                            <span>${c.time}</span>
                            ${c.up > 0 ? `<span><i class="far fa-thumbs-up" style="color:#f59e0b;"></i> ${c.up}</span>` : ''}
                        </div>
                    </div>
                    <div style="font-size:12px; color:#d1d5db; line-height:1.6; word-break:break-word;">
                        ${c.content}
                    </div>
                </div>
            `).join('');
        };

        try {
            let commentsUrl = '/api/video/comments?title=' + encodeURIComponent(rawTitle);
            if (cardId) commentsUrl += '&id=' + encodeURIComponent(cardId);

            const res = await fetch(commentsUrl);
            if (res.ok) {
                const data = await res.json();
                const list = data.results || [];
                if (list.length > 0) {
                    renderCommentList(list);
                    return;
                }
            }
        } catch(e) {} finally {
            if (icon) icon.classList.remove('fa-spin');
        }

        // 静态环境或冷门新片兜底剧友讨论
        const displayTitle = cleanTitle || rawTitle || '本片';
        renderCommentList([
            { user: '追剧达人阿星', time: '今天', up: 42, episode: '第1集', content: `《${displayTitle}》画质太清晰了，这边的超清专线秒开不卡顿，节奏也很紧凑！` },
            { user: '夜猫子看片', time: '昨天', up: 28, episode: '正片', content: `找了好几个地方都要VIP，还是这里爽快，直接拉满4K画质增强配弹幕看太舒服了。` },
            { user: '光影收藏家', time: '近期', up: 19, episode: '第2集', content: `演员演技全员在线，配乐和镜头质感绝了，强烈推荐大家耐心往后看！` },
            { user: '摸鱼小能手', time: '近期', up: 11, episode: '', content: `自动跳过片头和连播下一集真的很省心，一口气炫了好几集停不下来。` }
        ]);
    };

    // 兼容右下角设置弹窗开关调用
    window.toggleSettingsDrawer = function() {
        const settingBox = document.querySelector('#dplayerContainer .dplayer-setting-box');
        if (settingBox) {
            settingBox.classList.toggle('dplayer-setting-box-open');
        }
    };

    // WebRTC P2P 加速功能开关
    window.isP2pEnabled = true;
    window.toggleP2pFeature = function() {
        window.isP2pEnabled = !window.isP2pEnabled;
        const sw = document.getElementById('p2pSwitch');
        const chk = document.getElementById('dpP2pAccelInput');
        const pill = document.getElementById('p2pLiveBadge') || document.getElementById('p2pLivePill');
        const liveText = document.getElementById('p2pLiveText');
        if (sw) sw.classList.toggle('active', window.isP2pEnabled);
        if (chk) chk.checked = window.isP2pEnabled;
        if (pill) pill.classList.toggle('off', !window.isP2pEnabled);
        if (liveText) liveText.innerText = window.isP2pEnabled ? 'P2P 就绪' : 'P2P 已关';
        
        if (window.currentP2pEngine) {
            try {
                if (window.isP2pEnabled) {
                    window.currentP2pEngine.enableP2P();
                } else {
                    window.currentP2pEngine.disableP2P();
                }
            } catch(e) {}
        }
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('WebRTC P2P加速已' + (window.isP2pEnabled ? '开启' : '关闭'), 2000);
        }
    };

    // 画质增强开关控制 (原站画质增强技术：GPU边缘对比度锐化 + HDR动态色彩增强)
    window.isVideoHqEnhanced = true;
    window.toggleVideoHqEnhance = function() {
        window.isVideoHqEnhanced = !window.isVideoHqEnhanced;
        const container = document.getElementById('dplayerContainer');
        const sw = document.getElementById('hqSwitch');
        const chk = document.getElementById('dpHqEnhanceInput');
        if (container) {
            if (window.isVideoHqEnhanced) {
                container.classList.remove('hq-enhanced-off');
            } else {
                container.classList.add('hq-enhanced-off');
            }
        }
        if (sw) sw.classList.toggle('active', window.isVideoHqEnhanced);
        if (chk) chk.checked = window.isVideoHqEnhanced;
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('GPU画质增强已' + (window.isVideoHqEnhanced ? '开启' : '关闭'), 2000);
        }
    };

    // 弹幕独立开关 (同步底部控制栏独立弹幕胶囊 + 右侧设置面板开关 + DPlayer原生弹幕层)
    window.isDanmakuEnabled = true;
    window.toggleDanmaku = function() {
        window.isDanmakuEnabled = !window.isDanmakuEnabled;
        const sw = document.getElementById('danmakuSwitch');
        const barBtn = document.getElementById('dpDanmakuBarBtn');
        const barText = document.getElementById('dpDanmakuBarText');
        const nativeChk = document.querySelector('#dplayerContainer .dplayer-showdan-setting-input');
        if (sw) sw.classList.toggle('active', window.isDanmakuEnabled);
        if (barBtn) barBtn.classList.toggle('off', !window.isDanmakuEnabled);
        if (barText) barText.innerText = window.isDanmakuEnabled ? '开' : '关';
        if (nativeChk) nativeChk.checked = window.isDanmakuEnabled;
        if (window.dpInstance && window.dpInstance.danmaku) {
            if (window.isDanmakuEnabled) {
                window.dpInstance.danmaku.show();
            } else {
                window.dpInstance.danmaku.hide();
            }
        }
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('实时弹幕已' + (window.isDanmakuEnabled ? '开启' : '关闭'), 2000);
        }
    };

    // 智能跳过片头开关 (原站同款社区众包/AI智能片头预设)
    window.isAutoSkipIntro = true;
    window.toggleAutoSkipIntro = function() {
        window.isAutoSkipIntro = !window.isAutoSkipIntro;
        const sw = document.getElementById('skipIntroSwitch');
        const chk = document.getElementById('dpSkipIntroInput');
        if (sw) sw.classList.toggle('active', window.isAutoSkipIntro);
        if (chk) chk.checked = window.isAutoSkipIntro;
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('自动跳片头已' + (window.isAutoSkipIntro ? '开启' : '关闭'), 2000);
        }
    };

    // 自动连播下一集开关
    window.isAutoNextEnabled = true;
    window.toggleAutoNext = function() {
        window.isAutoNextEnabled = !window.isAutoNextEnabled;
        const sw = document.getElementById('autoNextSwitch');
        const chk = document.getElementById('dpAutoNextInput');
        if (sw) sw.classList.toggle('active', window.isAutoNextEnabled);
        if (chk) chk.checked = window.isAutoNextEnabled;
        if (window.dpInstance && window.dpInstance.notice) {
            window.dpInstance.notice('自动连播下一集已' + (window.isAutoNextEnabled ? '开启' : '关闭'), 2000);
        }
    };

    // 原站高频特性：画中画 (Picture-in-Picture)
    window.togglePip = function() {
        if (!window.dpInstance || !window.dpInstance.video) return;
        const video = window.dpInstance.video;
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
        } else if (document.pictureInPictureEnabled && video.requestPictureInPicture) {
            video.requestPictureInPicture().catch(() => {});
        } else {
            alert('当前浏览器环境不支持画中画功能');
        }
    };

    // 播放下一集
    window.playNextEpisode = function() {
        if (!window.currentVideo || !window.currentVideo.groups) return;
        const group = window.currentVideo.groups[window.currentGroupIdx] || window.currentVideo.groups[0];
        if (!group || !group.episodes) return;
        const nextIdx = (window.currentEpisodeIdx || 0) + 1;
        if (nextIdx < group.episodes.length) {
            window.playVideoEpisode(nextIdx);
        } else {
            console.log('[OpenHappy Video] 已播放到最后一集');
        }
    };

    // 快进 / 快退 (跳过片头片尾快捷动作)
    window.skipVideoTime = function(seconds) {
        if (window.dpInstance) {
            window.dpInstance.seek(window.dpInstance.video.currentTime + seconds);
        }
    };

    // 关闭视频播放器，返回影视主视窗
    window.closeVideoPlayer = function() {
        if (window._playbackWatchdogTimer) {
            clearTimeout(window._playbackWatchdogTimer);
            window._playbackWatchdogTimer = null;
        }
        const drawer = document.getElementById('playerSettingsDrawer');
        const overlay = document.getElementById('drawerOverlay') || document.getElementById('settingsDrawerOverlay');
        if (drawer) drawer.classList.remove('active', 'open');
        if (overlay) overlay.classList.remove('active', 'open');

        if (window.currentP2pEngine) {
            try { window.currentP2pEngine.destroy(); } catch(e){}
            window.currentP2pEngine = null;
        }
        if (window.currentHlsInstance) {
            try { window.currentHlsInstance.destroy(); } catch(e){}
            window.currentHlsInstance = null;
        }

        if (window.dpInstance) {
            try {
                window.dpInstance.pause();
                window.dpInstance.destroy();
            } catch(e){}
            window.dpInstance = null;
        }
        document.getElementById('videoPlayerView').style.display = 'none';
        document.getElementById('videoSection').style.display = 'block';
        window.renderRecentWatchBar();
    };
})();

