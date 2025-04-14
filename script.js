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

// 视频播放功能
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    
    // 标记是否已初始化视频播放器
    let videoInitialized = false;
    
    if (videoPlaceholder) {
        // 只在首次点击时初始化视频
        videoPlaceholder.addEventListener('click', function(e) {
            // 如果视频已经初始化，不要再处理点击事件
            if (videoInitialized) {
                return;
            }
            
            // 获取当前的视频缩略图路径
            const thumbnailImg = videoPlaceholder.querySelector('.video-thumbnail');
            const thumbnailSrc = thumbnailImg ? thumbnailImg.src : './images/poster.jpg';
            
            // 保存原始视频占位符大小和样式
            const originalWidth = videoPlaceholder.offsetWidth;
            const originalHeight = videoPlaceholder.offsetHeight;
            const originalStyle = window.getComputedStyle(videoPlaceholder);
            const originalBorder = originalStyle.border;
            const originalPadding = originalStyle.padding;
            
            // 更新视频HTML，最简单的实现
            videoPlaceholder.innerHTML = `
                <div class="video-container" style="position:relative; width:100%; height:100%; margin:0 auto; padding:0; border:none; overflow:hidden;">
                    <video id="mainVideo"
                           controls
                           playsinline
                           webkit-playsinline
                           x5-playsinline
                           preload="auto"
                           style="width:100%; height:100%; display:block; margin:0; padding:0; border:none; object-fit:contain; background-color:#000; z-index:1;">
                        <source src="./images/xuanchuanshiping.mp4" type="video/mp4">
                        <p data-en="Your browser does not support HTML5 video.">您的浏览器不支持HTML5视频。</p>
                    </video>
                </div>
            `;
            
            // 获取视频元素
            const video = document.getElementById('mainVideo');
            
            // 视频加载完成后自动播放
            if (video) {
                try {
                    // 尝试自动播放视频
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('自动播放失败:', error);
                            // 现代浏览器可能会阻止自动播放，这里可以添加静音自动播放
                            video.muted = true;
                            video.play().catch(err => {
                                console.error('静音自动播放也失败:', err);
                            });
                        });
                    }
                } catch (err) {
                    console.error('播放出错:', err);
                }
                
                // 视频播放结束时的处理
                video.addEventListener('ended', function() {
                    console.log('视频播放结束');
                });
                
                // 视频加载失败时的处理
                video.addEventListener('error', function() {
                    console.error('视频加载失败');
                });
            }
            
        }, { once: true }); // 只触发一次事件监听
    }
    
    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        #videoPlaceholder {
            position: relative;
            width: 100%;
            aspect-ratio: 16/9;
            overflow: hidden;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
        }
        
        .video-container {
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: none;
            overflow: hidden;
            box-sizing: border-box;
        }
        
        .video-container video {
            width: 100%;
            height: 100%;
            display: block;
            margin: 0;
            padding: 0;
            border: none;
            object-fit: contain;
            background-color: #000;
        }
        
        #bigPlayButton {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.3);
        }
        
        #bigPlayButton button {
            width: 80px;
            height: 80px;
            background-color: rgba(0, 0, 0, 0.6);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s ease;
        }
        
        #bigPlayButton button:hover {
            transform: scale(1.1);
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        /* 调整横竖屏下的视频播放器样式 */
        @media screen and (orientation: landscape) {
            #videoPlaceholder {
                width: 100%;
                max-height: 80vh;
            }
        }
        
        @media screen and (orientation: portrait) {
            #videoPlaceholder {
                width: 100%;
                max-height: 40vh;
            }
        }
    `;
    document.head.appendChild(style);
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

// 检测是否为安卓设备
function isAndroidDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
}