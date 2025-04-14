// 全局变量，用于跟踪当前语言状态
let isEnglish = false;
        
// 语言切换功能
function toggleLanguage() {
    console.log("语言切换函数被调用");
    
    // 反转语言状态
    isEnglish = !isEnglish;
    localStorage.setItem('language', isEnglish ? 'en' : 'zh');
    const htmlElement = document.documentElement; // 获取<html>元素
    if (isEnglish) {
        htmlElement.classList.add('lang-en');
    } else {
        htmlElement.classList.remove('lang-en');
    }
    
    // 获取所有可翻译元素
    const elementsWithTranslation = document.querySelectorAll('[data-en]');
    console.log("找到的可翻译元素数量:", elementsWithTranslation.length);
    
    // 遍历所有可翻译元素并切换语言
    elementsWithTranslation.forEach(element => {
        // 保存原始文本（如果还没有保存）
        if (!element.getAttribute('data-original')) {
            element.setAttribute('data-original', element.innerHTML);
        }
        
        // 切换文本内容
        if (isEnglish) {
            element.innerHTML = element.getAttribute('data-en');
        } else {
            element.innerHTML = element.getAttribute('data-original');
        }
    });
    
    // 更新语言切换按钮文本
    const currentLangElement = document.querySelector('.current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = isEnglish ? 'EN' : '中';
    }
    
    const otherLangElement = document.querySelectorAll('#langSwitch span:not(.current-lang):not(.lang-divider)')[0];
    if (otherLangElement) {
        otherLangElement.textContent = isEnglish ? '中' : 'EN';
    }
    
    // 更新网页标题
    const originalTitle = "奇闻异事 - 沉浸式剧本杀体验";
    const englishTitle = "Strange Tales - Immersive Murder Mystery Experience";
    document.title = isEnglish ? englishTitle : originalTitle;
    
    // 为语言切换按钮添加动画效果
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.classList.add('switched');
        setTimeout(() => {
            langSwitch.classList.remove('switched');
        }, 500);
    }
    // 切换logo品牌文字
const logoCn = document.querySelector('.logo-cn');
const logoEn = document.querySelector('.logo-en');

if (logoCn && logoEn) {
    if (isEnglish) {
      // 英文模式：显示英文logo，隐藏中文logo
      logoCn.style.display = 'none';
      logoEn.style.display = 'inline-block';
    } else {
      // 中文模式：显示中文logo，隐藏英文logo
      logoCn.style.display = 'inline-block';
      logoEn.style.display = 'none';
    }
  }

    console.log("语言已切换为:", isEnglish ? "英文" : "中文");
}

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language');
    
    if (savedLanguage) {
        // 如果有保存的语言设置
        if (savedLanguage === 'en' && !isEnglish) {
            // 如果保存的是英文但当前是中文，切换到英文
            toggleLanguage();
        } else if (savedLanguage === 'zh' && isEnglish) {
            // 如果保存的是中文但当前是英文，切换到中文
            toggleLanguage();
        }
    } else {
        // 如果没有保存的语言设置，根据浏览器语言自动选择
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.toLowerCase().startsWith('en') && !isEnglish) {
            // 如果浏览器语言是英文但当前不是英文，切换到英文
            toggleLanguage();
        }
    }
    // 导航菜单
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.menu ul li a');
    
// 二级菜单处理
const subMenuParents = document.querySelectorAll('.has-submenu');
    
function toggleSubmenu(e) {
    e.preventDefault();
    const parent = this.parentElement;
    console.log("切换子菜单状态");
    
    // 关闭其他打开的子菜单
    subMenuParents.forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    // 切换当前子菜单
    parent.classList.toggle('active');
    console.log("子菜单状态:", parent.classList.contains('active'));
}

// 为带子菜单的链接添加点击事件
subMenuParents.forEach(parent => {
    const link = parent.querySelector('a');
    
    // 添加点击事件（移动设备）
    if (window.innerWidth <= 991) {
        link.addEventListener('click', toggleSubmenu);
    }
});

// 窗口大小变化时重新添加事件
window.addEventListener('resize', function() {
    subMenuParents.forEach(parent => {
        const link = parent.querySelector('a');
        
        // 先移除所有事件
        link.removeEventListener('click', toggleSubmenu);
        
        // 重新添加事件（如果是移动设备）
        if (window.innerWidth <= 991) {
            link.addEventListener('click', toggleSubmenu);
        }
    });
});

    
// 为菜单按钮添加点击事件 - 修复
if (menuBtn) {
    // 移除可能存在的旧事件监听器
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    
    // 绑定点击事件
    newMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        menu.classList.toggle('active');
        console.log('菜单按钮被点击了!');
        
        // 当菜单关闭时，同时关闭所有打开的二级菜单
        if (!menu.classList.contains('active')) {
            // 找到所有打开的二级菜单并关闭它们
            const openSubmenus = document.querySelectorAll('.has-submenu.active');
            openSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
        }
    });
}
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // 检查这个链接是否是子菜单的父项
            const parentLi = this.parentElement;
            const isSubmenuParent = parentLi.classList.contains('has-submenu');
            
            // 如果不是子菜单的父项，正常收起菜单
            if (!isSubmenuParent) {
                menuBtn.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    });
    
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 淡入动画
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 50 && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    }
    
    // 初始检查
    checkFade();
    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
});
// 剧本筛选功能
const filterButtons = document.querySelectorAll('.filter-btn');
const filterableCards = document.querySelectorAll('.filterable-cards .script-card');

// 存储当前活跃的筛选器
const activeFilters = {
    difficulty: 'all',
    players: 'all',
    theme: 'all'
};

// 为所有筛选按钮添加点击事件
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter');
        const filterValue = this.getAttribute('data-value');
        
        // 清除当前类型的所有活跃状态
        document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加活跃状态到选中的按钮
        this.classList.add('active');
        
        // 更新活跃筛选器
        activeFilters[filterType] = filterValue;
        
        // 应用筛选
        applyFilters();
    });
});

// 初始化：将所有"全部"按钮标记为活跃
document.querySelectorAll('.filter-btn[data-value="all"]').forEach(btn => {
    btn.classList.add('active');
});

// 应用筛选器函数
function applyFilters() {
    filterableCards.forEach(card => {
        let isVisible = true;
        
        // 检查每个筛选条件
        for (const [filterType, filterValue] of Object.entries(activeFilters)) {
            if (filterValue !== 'all') {
                const cardValue = card.getAttribute(`data-${filterType}`);
                if (cardValue !== filterValue) {
                    isVisible = false;
                    break;
                }
            }
        }
        
        // 根据筛选结果显示或隐藏
        if (isVisible) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}
// 剧本数据
const scriptData = {
    script1: {
        name: "雪乡连环杀人事件",
        nameEn: "Murder in the Snow Village",
        duration: "3.5-4小时",
        durationEn: "3.5-4 hours",
        difficulty: "★★★★☆",
        players: "7人",
        playersEn: "7 players",
        image: "./images/xuexiang.jpg",
        description: "“这世界上的真相只有一个，排除所有的不可能，剩下的那一个，无论有多么的让你不可置信，那都是真相。”“年三十，北道河，村里出了个杀人魔”“七个小孩来串门，联起手来把案破”",
        descriptionEn: "“There is only one truth in this world: once you've eliminated all impossibilities, whatever remains—no matter how unbelievable—must be the truth.”“New Year's Eve. Beidao River. A murderer emerged from the village.”“Seven children came to visit—and together, they uncovered the killer.”"
    },
    script2: {
        name: "青楼",
        nameEn: "Fragrant Pavilion",
        duration: "4-5小时",
        durationEn: "4-5 hours",
        difficulty: "★★★★☆",
        players: "7人",
        playersEn: "7 players",
        image: "./images/qinglou.jpg",
        description: "唐朝，可谓歌舞盛华，乐文辉煌。与此同时，女伎们的身价也推向了巅峰。青楼之市火爆，歌舞伎成了热门之业。沦落为青楼女子虽不光彩，但依然有很多人选择这一职业，在这些女子中，琴棋书画兼备的也大有人在…在长安城内，有一青楼，名为\"玉满楼\"，别名\"玉月满花\"，此中之女子皆是琴棋书画兼备，相传呐，那都是卖艺不卖身的存在。我们的故事就要从这玉满楼开始说起。",
        descriptionEn: "In the Tang Dynasty, an era famed for its flourishing music, dance, and literature, the value of female performers soared to unprecedented heights. The entertainment quarters thrived, and the art of song and dance became one of the most coveted professions. Though falling into the life of a courtesan was often seen as dishonorable, many still chose this path—and among them, there were those well-versed in the four arts: music, chess, calligraphy, and painting.Within the grand city of Chang'an stood a famed establishment known as Yuman Lou, also called \"Jade Moon in Bloom.\"It was said that the women of this house sold only their art, not their bodies. Talented, elegant, and enigmatic, they were revered as artists rather than mere entertainers.And so, our story begins—within the walls of Yuman Lou, where beauty hides secrets, and every performance may veil a deeper truth..."
    },
    script3: {
        name: "病娇男孩的精分日记",
        nameEn: "The Split Diary of a Yandere Boy",
        duration: "4-5小时",
        durationEn: "4-5 hours",
        difficulty: "★★★★★",
        players: "7人",
        playersEn: "7 players",
        image: "./images/bingjiao.jpg",
        description: "\"我有七个我，我便拥有了更丰盈的生命和更孤单的生活；热闹是我的，孤独也是我的\"",
        descriptionEn: "\"With seven selves, I live a fuller life—and a lonelier one.The noise belongs to me, and so does the silence.\""
    }
};

// 打开剧本弹出卡片
function openScriptPopup(scriptId) {
    const script = scriptData[scriptId];
    if (!script) return;
    
    // 检测当前语言
    const isEnglish = document.documentElement.classList.contains('lang-en');
    
    // 构建弹出卡片内容
    let content = `
        <div class="script-popup-header">
            <img src="${script.image}" alt="${isEnglish ? script.nameEn : script.name}" class="script-popup-img">
            <div class="script-popup-title">
                <h2>${isEnglish ? script.nameEn : script.name}</h2>
                <div class="script-popup-meta">
                    <span class="script-meta-item"><i class="fas fa-users"></i> ${isEnglish ? script.playersEn : script.players}</span>
                    <span class="script-meta-item"><i class="fas fa-clock"></i> ${isEnglish ? script.durationEn : script.duration}</span>
                    <span class="script-meta-item"><i class="fas fa-star"></i> ${script.difficulty}</span>
                </div>
            </div>
        </div>

        <div class="script-popup-section">
            <h3>${isEnglish ? "Description" : "剧本简介"}</h3>
            <p>${isEnglish ? script.descriptionEn : script.description}</p>
        </div>
    `;
    
    // 填充并显示弹出卡片
    document.getElementById('scriptPopupContent').innerHTML = content;
    document.getElementById('scriptPopupOverlay').style.display = 'block';
    document.getElementById('scriptPopup').style.display = 'block';
    
    // 防止滚动
    document.body.style.overflow = 'hidden';
}

// 关闭剧本弹出卡片
function closeScriptPopup() {
    document.getElementById('scriptPopupOverlay').style.display = 'none';
    document.getElementById('scriptPopup').style.display = 'none';
    
    // 恢复滚动
    document.body.style.overflow = '';
}

// 为剧本卡片添加点击事件
document.addEventListener('DOMContentLoaded', function() {
    // 为所有剧本卡片添加点击事件
    const scriptCards = document.querySelectorAll('.script-card');
    scriptCards.forEach((card, index) => {
        const scriptId = `script${index + 1}`;
        card.setAttribute('data-script-id', scriptId);
        
        // 为详情按钮单独添加点击事件
        const detailBtn = card.querySelector('.dm-more');
        if (detailBtn) {
            detailBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发父元素的点击事件
                openScriptPopup(card.getAttribute('data-script-id'));
            });
        }
    });
    
    // 将点击整个卡片作为备选方案
    scriptCards.forEach(card => {
        card.addEventListener('click', function() {
            openScriptPopup(this.getAttribute('data-script-id'));
        });
    });
});
// 自动检测页面类型并添加相应的类名
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    
    // 检测当前页面类型
    if (currentPath.includes('mahjong.html')) {
      document.body.classList.add('mahjong-page');
    } else if (currentPath.includes('bar.html')) {
      document.body.classList.add('bar-page');
    }
    
    // 既有淡入动画检测
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
  });

// 检测是否为苹果设备（iOS或macOS）
function isAppleDevice() {
    // 检测常见的苹果设备平台
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|macintosh/.test(userAgent);
}

// 进一步检测是否为iOS设备
function isIOSDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // 支持iPad Pro检测
}

// 视频全屏函数
function enterFullScreen(video) {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { // Safari
        video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) { // iOS Safari
        video.webkitEnterFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
    }
}

// 视频播放功能
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // 获取当前的视频缩略图路径
            const thumbnailImg = videoPlaceholder.querySelector('.video-thumbnail');
            const thumbnailSrc = thumbnailImg ? thumbnailImg.src : './images/poster.jpg';
            
            // 检测是否为iOS设备
            const isIOS = isIOSDevice();
            
            // 创建视频元素，为iOS设备添加额外属性和样式
            const videoHTML = `
                <div class="video-container" style="position:relative; width:fit-content; max-width:100%; margin:0 auto; padding:0; border:none; box-sizing:border-box; display:inline-block; line-height:0;">
                    <video width="auto" controls autoplay playsinline 
                           webkit-playsinline
                           x-webkit-airplay="allow"
                           x5-video-player-type="h5"
                           x5-video-player-fullscreen="true"
                           x5-video-orientation="portraint"
                           preload="auto"
                           poster="${thumbnailSrc}"
                           id="mainVideo"
                           style="cursor: pointer; background-color: #000; max-width:100%; display:block; width:auto; height:auto; margin:0; padding:0; border:none;">
                        <source src="./images/xuanchuanshiping.mp4" type="video/mp4">
                        <p data-en="Your browser does not support HTML5 video.">您的浏览器不支持HTML5视频。</p>
                    </video>
                    ${isIOS ? 
                    `<button id="fullscreenBtn" style="position:absolute; top:10px; left:10px; z-index:100; 
                     background-color:rgba(0,0,0,0.6); color:white; border:none; border-radius:50%; 
                     width:36px; height:36px; font-size:16px; display:flex; align-items:center; 
                     justify-content:center; padding:0;">
                        <i class="fas fa-expand" style="color:white;"></i>
                    </button>` : ''}
                    <style>
                        /* 移除所有控制器的蒙层效果 */
                        #mainVideo::-webkit-media-controls-panel,
                        #mainVideo::-webkit-media-controls-overlay,
                        #mainVideo::-webkit-media-controls-backdrop {
                            background: transparent !important;
                            backdrop-filter: none !important;
                            -webkit-backdrop-filter: none !important;
                        }
                        /* 确保控制条按钮显示 */
                        #mainVideo::-webkit-media-controls-play-button,
                        #mainVideo::-webkit-media-controls-timeline,
                        #mainVideo::-webkit-media-controls-current-time-display,
                        #mainVideo::-webkit-media-controls-time-remaining-display,
                        #mainVideo::-webkit-media-controls-mute-button,
                        #mainVideo::-webkit-media-controls-fullscreen-button {
                            color: #fff !important;
                            opacity: 1 !important;
                        }
                        /* 设置下拉菜单背景 */
                        #mainVideo::-internal-media-controls-overflow-menu-list {
                            background-color: rgba(0, 0, 0, 0.7) !important;
                            backdrop-filter: none !important;
                        }
                    </style>
                </div>
            `;
            videoPlaceholder.innerHTML = videoHTML;
            
            // 更新videoPlaceholder的样式，使其适应视频大小
            videoPlaceholder.style.display = 'flex';
            videoPlaceholder.style.justifyContent = 'center';
            videoPlaceholder.style.alignItems = 'center';
            videoPlaceholder.style.width = 'auto';
            videoPlaceholder.style.maxWidth = '100%';
            videoPlaceholder.style.padding = '0';
            videoPlaceholder.style.margin = '0 auto';
            videoPlaceholder.style.border = 'none';
            videoPlaceholder.style.backgroundColor = 'transparent';
            videoPlaceholder.style.overflow = 'hidden';
            videoPlaceholder.style.lineHeight = '0';
            
            // 获取视频元素
            const video = document.getElementById('mainVideo');
            
            // 确保视频加载后调整尺寸
            if (video) {
                video.onloadeddata = function() {
                    // 调整容器大小匹配视频
                    const container = video.parentElement;
                    container.style.width = video.videoWidth + 'px';
                    container.style.maxWidth = '100%';
                };
            }
            
            // iOS设备的全屏按钮处理
            if (isIOS) {
                const fullscreenBtn = document.getElementById('fullscreenBtn');
                if (fullscreenBtn) {
                    fullscreenBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        enterFullScreen(video);
                    });
                }
            }
            
            // 设置视频的元数据加载完成事件
            if (video) {
                video.onloadedmetadata = function() {
                    // 确保视频控制条可见
                    this.controls = true;
                    
                    // 移除默认的控制器样式
                    this.classList.add('custom-controls');
                    
                    // 双击计时器变量
                    let lastTapTime = 0;
                    let lastTapX = 0;
                    
                    // 检测是否为iOS设备
                    const isIOS = isIOSDevice();
                    
                    // iOS设备专用处理 - 添加一个透明覆盖层用于捕获点击事件
                    if (isIOS) {
                        // 创建覆盖层
                        const overlay = document.createElement('div');
                        overlay.id = 'videoOverlay';
                        overlay.style.position = 'absolute';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '80%'; // 覆盖视频的80%，留出底部控制栏
                        overlay.style.zIndex = '2';
                        overlay.style.cursor = 'pointer';
                        
                        // 将覆盖层添加到视频容器
                        const videoContainer = this.parentElement;
                        videoContainer.style.position = 'relative';
                        videoContainer.appendChild(overlay);
                        
                        // 为覆盖层添加点击事件
                        overlay.addEventListener('click', function(e) {
                            if (video.paused) {
                                video.play();
                            } else {
                                video.pause();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                        }, {passive: false});
                        
                        // 处理快进快退双击操作
                        let touchStartTime = 0;
                        let touchStartX = 0;
                        
                        overlay.addEventListener('touchstart', function(e) {
                            // 检测是否为多指触摸(可能是放大手势)
                            if (e.touches.length > 1) {
                                // 直接将事件传递给视频元素，不阻止默认行为
                                overlay.style.pointerEvents = 'none';
                                setTimeout(() => {
                                    overlay.style.pointerEvents = 'auto';
                                }, 500); // 500ms后恢复覆盖层事件捕获
                                return;
                            }
                            
                            const touch = e.touches[0];
                            const currentTime = new Date().getTime();
                            
                            // 保存触摸起始信息
                            touchStartTime = currentTime;
                            touchStartX = touch.clientX;
                            
                            // 判断是否为双击（距离上次点击小于300ms）
                            if (currentTime - lastTapTime < 300 && Math.abs(touchStartX - lastTapX) < 30) {
                                const videoWidth = videoContainer.clientWidth;
                                
                                // 左侧快退
                                if (touchStartX < videoWidth * 0.4) {
                                    video.currentTime = Math.max(0, video.currentTime - 10);
                                    showSeekIndicator(video, 'backward');
                                }
                                // 右侧快进
                                else if (touchStartX > videoWidth * 0.6) {
                                    video.currentTime = Math.min(video.duration, video.currentTime + 10);
                                    showSeekIndicator(video, 'forward');
                                }
                                // 中间双击全屏
                                else {
                                    enterFullScreen(video);
                                }
                                
                                e.preventDefault();
                            }
                            
                            // 更新上次点击信息
                            lastTapTime = currentTime;
                            lastTapX = touchStartX;
                        }, {passive: false});
                        
                        // 添加双击全屏功能
                        overlay.addEventListener('dblclick', function(e) {
                            enterFullScreen(video);
                        });
                        
                        // 添加全屏按钮点击处理
                        overlay.addEventListener('touchend', function(e) {
                            // 检查点击位置是否在视频底部控制区域
                            const rect = video.getBoundingClientRect();
                            const touchY = e.changedTouches[0].clientY - rect.top;
                            
                            // 如果点击在底部20%区域，可能是控制条区域，不干预
                            if (touchY > rect.height * 0.8) {
                                // 临时禁用覆盖层捕获事件，让事件传递到控制条
                                overlay.style.pointerEvents = 'none';
                                setTimeout(() => {
                                    overlay.style.pointerEvents = 'auto';
                                }, 500);
                            }
                        });
                    } 
                    // 非iOS设备的标准处理
                    else {
                        // 添加点击视频暂停/播放功能
                        this.addEventListener('click', function(e) {
                            // 获取点击位置相对于视频元素的坐标
                            const rect = this.getBoundingClientRect();
                            const clickY = e.clientY - rect.top;
                            const clickX = e.clientX - rect.left;
                            
                            // 控制条高度大约为视频高度的15%
                            const controlsHeight = rect.height * 0.15;
                            
                            // 如果点击位置不在控制条区域
                            if (clickY < rect.height - controlsHeight) {
                                // 判断视频当前状态并切换
                                if (this.paused) {
                                    this.play();
                                } else {
                                    this.pause();
                                }
                                
                                // 取消事件默认行为和冒泡，防止浏览器自动处理
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                        });
                        
                        // 添加双击全屏功能
                        this.addEventListener('dblclick', function(e) {
                            enterFullScreen(this);
                        });
                        
                        // 触摸事件处理（针对非iOS移动设备）
                        this.addEventListener('touchend', function(e) {
                            // 获取触摸结束位置相对于视频元素的坐标
                            const rect = this.getBoundingClientRect();
                            const touchY = e.changedTouches[0].clientY - rect.top;
                            
                            // 控制条高度大约为视频高度的20%（移动端触摸区域更大）
                            const controlsHeight = rect.height * 0.2;
                            
                            // 如果触摸结束位置不在控制条区域
                            if (touchY < rect.height - controlsHeight) {
                                if (this.paused) {
                                    this.play();
                                } else {
                                    this.pause();
                                }
                                // 防止事件传播和默认行为
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        }, {passive: false});
                    }
                    
                    // 防止控制栏播放按钮的冲突
                    this.addEventListener('play', function(e) {
                        // 允许控制栏发起的播放事件
                        if (e.isTrusted) {
                            e.stopPropagation();
                        }
                    });
                    
                    this.addEventListener('pause', function(e) {
                        // 允许控制栏发起的暂停事件
                        if (e.isTrusted) {
                            e.stopPropagation();
                        }
                    });
                    
                    // 为速度菜单点击添加监听，防止蒙层
                    this.addEventListener('ratechange', function() {
                        // 移除可能出现的蒙层
                        const mediaControls = document.querySelector('#mainVideo::-webkit-media-controls');
                        if (mediaControls) {
                            mediaControls.style.backgroundColor = 'transparent';
                        }
                    });
                    
                    // 添加MutationObserver监听DOM变化，移除可能动态添加的蒙层
                    const observer = new MutationObserver(function(mutations) {
                        // 遍历所有变化
                        mutations.forEach(function(mutation) {
                            // 检查是否有新节点添加
                            if (mutation.addedNodes.length) {
                                // 检查视频控制器
                                const controls = document.querySelectorAll('#mainVideo::-webkit-media-controls, #mainVideo::-webkit-media-controls-panel');
                                controls.forEach(control => {
                                    control.style.backgroundColor = 'transparent';
                                    control.style.backdropFilter = 'none';
                                });
                            }
                        });
                    });
                    
                    // 配置和启动观察器
                    observer.observe(document.body, { childList: true, subtree: true });
                };
            }
        });
    }
});

// 显示快进/快退指示器
function showSeekIndicator(videoElement, direction) {
    // 移除可能已存在的指示器
    const existingIndicator = document.querySelector('.seek-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // 创建指示器元素
    const indicator = document.createElement('div');
    indicator.className = 'seek-indicator';
    
    // 设置指示器样式
    indicator.style.position = 'absolute';
    indicator.style.top = '50%';
    indicator.style.left = direction === 'forward' ? '70%' : '30%';
    indicator.style.transform = 'translate(-50%, -50%)';
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '10px 15px';
    indicator.style.borderRadius = '50%';
    indicator.style.fontSize = '24px';
    indicator.style.display = 'flex';
    indicator.style.justifyContent = 'center';
    indicator.style.alignItems = 'center';
    indicator.style.zIndex = '999';
    indicator.style.opacity = '0';
    indicator.style.transition = 'opacity 0.2s ease-in-out';
    
    // 设置图标
    indicator.innerHTML = direction === 'forward' 
        ? '<i class="fas fa-forward" style="color: white;"></i>'
        : '<i class="fas fa-backward" style="color: white;"></i>';
        
    // 如果没有FontAwesome图标库，使用替代文本
    if (!document.querySelector('link[href*="font-awesome"]')) {
        indicator.textContent = direction === 'forward' ? '>>10s' : '<<10s';
    }
    
    // 将指示器添加到视频容器
    const videoContainer = videoElement.parentElement;
    videoContainer.style.position = 'relative';
    videoContainer.appendChild(indicator);
    
    // 显示指示器
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 0);
    
    // 淡出指示器
    setTimeout(() => {
        indicator.style.opacity = '0';
        
        // 移除指示器
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }, 800);
}

// 打开地图函数 - 自动检测设备类型并打开相应地图
function openMap() {
    if (isAppleDevice()) {
        openAppleMap();
    } else {
        openGoogleMap();
    }
}

// 打开谷歌地图
function openGoogleMap() {
    window.open('https://maps.google.com/?q=Q%2B+Social+Box,+East+Timber+Yard,+112+Pershore+St,+Birmingham+B5+6PA', '_blank');
}

// 打开苹果地图
function openAppleMap() {
    window.open('https://maps.apple.com/?address=112%20Pershore%20Street,%20Birmingham,%20B5%206PA,%20England&ll=52.47370,-1.89445&lsp=9902&q=Q%2B%20Social%20Box&t=m', '_blank');
}

// FAQ切换函数
function toggleFaq(element) {
    // 获取问题元素
    const question = element;
    // 获取答案元素（问题的下一个兄弟元素）
    const answer = question.nextElementSibling;
    // 获取当前FAQ项
    const faqItem = question.parentElement;
    
    // 切换FAQ项的active类来控制答案显示
    faqItem.classList.toggle('active');
    
    // 更改图标
    const icon = question.querySelector('.faq-toggle i');
    if (icon) {
        if (faqItem.classList.contains('active')) {
            // 使用水平减号图标
            icon.className = 'fas fa-minus';
            // 确保没有旋转样式
            icon.style.transform = 'none';
        } else {
            icon.className = 'fas fa-plus';
        }
    }
}