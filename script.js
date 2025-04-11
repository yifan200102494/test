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
// DM数据
const dmData = {
    dm1: {
        name: "彩虹（特色）",
        nameEn: "Rainbow",
        title: "悬疑推理专家",
        titleEn: "Mystery & Suspense Expert",
        image: "./images/test.jpg",
        specialties: [
            { zh: "狼人杀", en: "Werewolves of Miller's Hollow" },
            { zh: "侦探推理", en: "Detective" },
            { zh: "情感演绎", en: "Emotional deduction" }
        ],
        scripts: [
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" }
        ],
        gallery: [
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg"
        ],
        videoUrl: "./images/shiping.mp4",
        videoPlaceholder: "./images/shiping.mp4",
        bio: "彩虹拥有5年带本经验，尤其擅长营造紧张氛围和设计巧妙的推理线索。他的剧本富有层次感，能够让玩家在解谜过程中获得极大的满足感。",
        bioEn: " has 5 years of experience, specializing in creating tense atmospheres and designing clever reasoning clues. His scripts have layers of depth, allowing players to gain great satisfaction during the puzzle-solving process."
    },
    dm2: {
        name: "雪花",
        nameEn: "snowflake",
        title: "恐怖剧本专家",
        titleEn: "Horror Script Expert",
        image: "./images/test.jpg",
        specialties: [
            { zh: "恐怖惊悚", en: "Horror & Thriller" },
            { zh: "心理压力", en: "Psychological Pressure" },
            { zh: "沉浸式体验", en: "Immersive Experience" }
        ],
        scripts: [
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" }
        ],
        gallery: [
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg"
        ],
        videoUrl: "",
        videoPlaceholder: "/api/placeholder/600/400",
        bio: "雪花专注于恐怖题材的剧本，善于通过声音、灯光和道具营造恐怖氛围。他的互动式带本风格让玩家能够深度沉浸在故事中，体验惊险刺激的游戏过程。",
        bioEn: " focuses on horror-themed scripts and is good at creating scary atmospheres through sound, lighting, and props. His interactive style allows players to become deeply immersed in the story and experience thrilling gameplay."
    },
    dm3: {
        name: "早早",
        nameEn: "zaozao",
        title: "剧本专家",
        titleEn: "Script Expert",
        image: "./images/test.jpg",
        specialties: [
            { zh: "体验满分", en: "Experience full score" },
            { zh: "新手友好", en: "Beginner-friendly" },
            { zh: "团队合作", en: "Team Cooperation" }
        ],
        scripts: [
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" },
            { zh: "剧本", en: "script" }
        ],
        gallery: [
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg",
            "./images/test.jpg"
        ],
        videoUrl: "",
        videoPlaceholder: "/api/placeholder/600/400",
        bio: "擅长设计奇幻题材的剧本，特别适合新手玩家。他的剧本规则简单易懂，引导清晰，能够帮助初次接触剧本杀的玩家快速融入游戏，体验剧本杀的乐趣。",
        bioEn: " specializes in designing fantasy-themed scripts that are particularly suitable for new players. His scripts have simple and easy-to-understand rules with clear guidance, helping first-time players quickly immerse themselves in the game."
    }
};

// 打开DM弹出卡片
function openDmPopup(dmId) {
    const dm = dmData[dmId];
    if (!dm) return;
    
    // 检测当前语言
    const isEnglish = document.querySelector('.lang-switch .current-lang').textContent === 'EN';
    
    // 构建弹出卡片内容
    let content = `
        <div class="dm-popup-header">
            <img src="${dm.image}" alt="${isEnglish ? dm.nameEn : dm.name}" class="dm-popup-img">
            <div class="dm-popup-title">
                <h2>${isEnglish ? dm.nameEn : dm.name}</h2>
                <p>${isEnglish ? dm.titleEn : dm.title}</p>
            </div>
        </div>

        <div class="dm-popup-section">
            <h3>${isEnglish ? "About" : "个人简介"}</h3>
            <p>${isEnglish ? dm.bioEn : dm.bio}</p>
        </div>

        <div class="dm-popup-section">
            <h3>${isEnglish ? "Specialties" : "专长领域"}</h3>
            <div class="dm-script-list">
                ${dm.specialties.map(item => `
                    <span class="dm-script-badge">${isEnglish ? item.en : item.zh}</span>
                `).join('')}
            </div>
        </div>

        <div class="dm-popup-section">
            <h3>${isEnglish ? "Featured Scripts" : "代表剧本"}</h3>
            <div class="dm-script-list">
                ${dm.scripts.map(item => `
                    <span class="dm-script-badge">${isEnglish ? item.en : item.zh}</span>
                `).join('')}
            </div>
        </div>

        <div class="dm-popup-section">
            <h3>${isEnglish ? "Performance Gallery" : "现场照片"}</h3>
            <div class="dm-gallery">
                ${dm.gallery.map(img => `
                    <img src="${img}" alt="${isEnglish ? "Gallery image" : "剧本现场"}" onclick="enlargeImage(this.src)">
                `).join('')}
            </div>
        </div>

        <div class="dm-popup-section">
            <h3>${isEnglish ? "Demo Video" : "演示视频"}</h3>
            ${dm.videoUrl ? 
                `<div class="video-container" style="position: relative; max-width: 100%; height: auto;">
                    <video width="100%" controls playsinline 
                       webkit-playsinline
                       x-webkit-airplay="allow"
                       x5-video-player-type="h5"
                       x5-video-player-fullscreen="true"
                       x5-video-orientation="portraint"
                       preload="auto"
                       poster="./images/poster.jpg"
                       class="dm-custom-video"
                       style="cursor: pointer; background-color: #000; max-width: 100%; border-radius: 8px;">
                        <source src="${dm.videoUrl}" type="video/mp4">
                        <p data-en="Your browser does not support HTML5 video.">您的浏览器不支持HTML5视频。</p>
                    </video>
                    <style>
                        .dm-custom-video::-webkit-media-controls-panel,
                        .dm-custom-video::-webkit-media-controls-overlay,
                        .dm-custom-video::-webkit-media-controls-backdrop {
                            background: transparent !important;
                            backdrop-filter: none !important;
                            -webkit-backdrop-filter: none !important;
                        }
                        .dm-custom-video::-webkit-media-controls-play-button,
                        .dm-custom-video::-webkit-media-controls-timeline,
                        .dm-custom-video::-webkit-media-controls-current-time-display,
                        .dm-custom-video::-webkit-media-controls-time-remaining-display,
                        .dm-custom-video::-webkit-media-controls-mute-button,
                        .dm-custom-video::-webkit-media-controls-fullscreen-button {
                            color: #fff !important;
                            opacity: 1 !important;
                        }
                        .dm-custom-video::-internal-media-controls-overflow-menu-list {
                            background-color: rgba(0, 0, 0, 0.7) !important;
                            backdrop-filter: none !important;
                        }
                    </style>
                </div>` : 
                `<img src="${dm.videoPlaceholder}" alt="${isEnglish ? "Video placeholder" : "视频占位图"}" class="dm-video" style="object-fit: cover; height: auto;">
                <p style="text-align: center; color: #777;">${isEnglish ? "Video coming soon" : "视频即将上线"}</p>`
            }
        </div>
    `;
    
    // 填充并显示弹出卡片
    document.getElementById('dmPopupContent').innerHTML = content;
    document.getElementById('dmPopupOverlay').style.display = 'block';
    document.getElementById('dmPopup').style.display = 'block';
    
    // 防止滚动
    document.body.style.overflow = 'hidden';
    
    // 初始化视频交互
    setTimeout(() => {
        initDmVideoInteraction();
    }, 100);
}

// 关闭DM弹出卡片
function closeDmPopup() {
    document.getElementById('dmPopupOverlay').style.display = 'none';
    document.getElementById('dmPopup').style.display = 'none';
    
    // 恢复滚动
    document.body.style.overflow = '';
}

// 初始化DM弹出卡片中的视频交互
function initDmVideoInteraction() {
    const video = document.querySelector('.dm-custom-video');
    if (!video) return;
    
    // 确保视频控制条可见
    video.controls = true;
    
    // 移除默认的控制器样式
    video.classList.add('custom-controls');
    
    // 双击计时器变量
    let lastTapTime = 0;
    let lastTapX = 0;
    
    // 添加点击视频暂停/播放功能
    video.addEventListener('click', function(e) {
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
    
    // 防止控制栏播放按钮的冲突
    video.addEventListener('play', function(e) {
        // 允许控制栏发起的播放事件
        if (e.isTrusted) {
            e.stopPropagation();
        }
    });
    
    video.addEventListener('pause', function(e) {
        // 允许控制栏发起的暂停事件
        if (e.isTrusted) {
            e.stopPropagation();
        }
    });
    
    // 添加触摸事件监听（针对移动设备）
    video.addEventListener('touchstart', function(e) {
        // 记录触摸起始位置
        const touch = e.touches[0];
        const touchX = touch.clientX - this.getBoundingClientRect().left;
        const touchY = touch.clientY - this.getBoundingClientRect().top;
        
        // 计算双击时间间隔
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        // 如果不在控制区域，且是双击（300ms内的两次点击）
        const controlsHeight = this.getBoundingClientRect().height * 0.2;
        if (touchY < this.getBoundingClientRect().height - controlsHeight && tapLength < 300 && Math.abs(touchX - lastTapX) < 30) {
            // 根据双击位置执行快进或快退
            const videoWidth = this.getBoundingClientRect().width;
            
            // 左侧区域快退10秒
            if (touchX < videoWidth * 0.4) {
                this.currentTime = Math.max(0, this.currentTime - 10);
                // 显示快退提示
                showSeekIndicator(this, 'backward');
            }
            // 右侧区域快进10秒
            else if (touchX > videoWidth * 0.6) {
                this.currentTime = Math.min(this.duration, this.currentTime + 10);
                // 显示快进提示
                showSeekIndicator(this, 'forward');
            }
            
            // 阻止默认行为防止播放/暂停触发
            e.preventDefault();
        }
        
        // 更新上次点击时间和位置
        lastTapTime = currentTime;
        lastTapX = touchX;
    }, {passive: false});
    
    video.addEventListener('touchend', function(e) {
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

// 放大图片
function enlargeImage(src) {
    // 创建临时的大图浏览层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgb(0, 0, 0)';
    overlay.style.zIndex = '1100';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.cursor = 'pointer';
    
    // 添加右上角关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '15px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '1101';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.style.display = 'flex';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.background = 'rgba(0, 0, 0, 0.3)';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.objectFit = 'contain';
    
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    
    // 点击关闭按钮关闭
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        document.body.removeChild(overlay);
    });
    
    // 点击图片外区域关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // 移动端侧滑返回
    let touchStartX = 0;
    let touchEndX = 0;
    
    overlay.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    overlay.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        // 如果向右滑动距离超过50px，关闭图片
        if (touchEndX - touchStartX > 50) {
            document.body.removeChild(overlay);
        }
    }, false);
    
    // ESC键关闭
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// 关闭弹出层的键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDmPopup();
    }
});
// 搜索功能

// FAQ切换功能
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const wasActive = faqItem.classList.contains('active');
    
    // 关闭所有其他FAQ项
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 如果当前项不是激活状态，则激活它
    if (!wasActive) {
        faqItem.classList.add('active');
    }
}
// 剧本数据
const scriptData = {
    script1: {
        name: "剧本1",
        nameEn: "剧本1",
        duration: "3-4小时",
        durationEn: "3-4 hours",
        difficulty: "★★★☆☆",
        players: "6-8人",
        playersEn: "6-8 players",
        image: "./images/test.jpg",
        description: "一些描述",
        descriptionEn: "Some description"
    },
    script2: {
        name: "剧本2",
        nameEn: "剧本2",
        duration: "4-5小时",
        durationEn: "4-5 hours",
        difficulty: "★★★★☆",
        players: "7-9人",
        playersEn: "7-9 players",
        image: "./images/test.jpg",
        description: "一些描述",
        descriptionEn: "Some description"
    },
    script3: {
        name: "剧本3",
        nameEn: "剧本3",
        duration: "3-4小时",
        durationEn: "3-4 hours",
        difficulty: "★★★★★",
        players: "5-7人",
        playersEn: "5-7 players",
        image: "./images/test.jpg",
        description: "一些描述",
        descriptionEn: "Some description"
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
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // 获取当前的视频缩略图路径
            const thumbnailImg = videoPlaceholder.querySelector('.video-thumbnail');
            const thumbnailSrc = thumbnailImg ? thumbnailImg.src : './images/poster.jpg';
            
            // 创建视频元素
            const videoHTML = `
                <video width="100%" height="220px" controls autoplay playsinline 
                       webkit-playsinline
                       x-webkit-airplay="allow"
                       x5-video-player-type="h5"
                       x5-video-player-fullscreen="true"
                       x5-video-orientation="portraint"
                       preload="auto"
                       poster="${thumbnailSrc}"
                       id="mainVideo"
                       style="cursor: pointer; background-color: #000;">
                    <source src="./images/shiping.mp4" type="video/mp4">
                    <p data-en="Your browser does not support HTML5 video.">您的浏览器不支持HTML5视频。</p>
                </video>
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
            `;
            videoPlaceholder.innerHTML = videoHTML;
            
            // 获取视频元素
            const video = document.getElementById('mainVideo');
            
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
                    
                    // 添加触摸事件监听（针对移动设备）
                    this.addEventListener('touchstart', function(e) {
                        // 记录触摸起始位置
                        const touch = e.touches[0];
                        const touchX = touch.clientX - this.getBoundingClientRect().left;
                        const touchY = touch.clientY - this.getBoundingClientRect().top;
                        
                        // 计算双击时间间隔
                        const currentTime = new Date().getTime();
                        const tapLength = currentTime - lastTapTime;
                        
                        // 如果不在控制区域，且是双击（300ms内的两次点击）
                        const controlsHeight = this.getBoundingClientRect().height * 0.2;
                        if (touchY < this.getBoundingClientRect().height - controlsHeight && tapLength < 300 && Math.abs(touchX - lastTapX) < 30) {
                            // 根据双击位置执行快进或快退
                            const videoWidth = this.getBoundingClientRect().width;
                            
                            // 左侧区域快退10秒
                            if (touchX < videoWidth * 0.4) {
                                this.currentTime = Math.max(0, this.currentTime - 10);
                                // 显示快退提示
                                showSeekIndicator(this, 'backward');
                            }
                            // 右侧区域快进10秒
                            else if (touchX > videoWidth * 0.6) {
                                this.currentTime = Math.min(this.duration, this.currentTime + 10);
                                // 显示快进提示
                                showSeekIndicator(this, 'forward');
                            }
                            
                            // 阻止默认行为防止播放/暂停触发
                            e.preventDefault();
                        }
                        
                        // 更新上次点击时间和位置
                        lastTapTime = currentTime;
                        lastTapX = touchX;
                    }, {passive: false});
                    
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