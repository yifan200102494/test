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
            element.setAttribute('data-original', element.textContent);
        }
        
        // 切换文本内容
        if (isEnglish) {
            element.textContent = element.getAttribute('data-en');
        } else {
            element.textContent = element.getAttribute('data-original');
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
        nameEn: "DM 彩虹",
        title: "悬疑推理专家",
        titleEn: "Mystery & Suspense Expert",
        image: "/api/placeholder/400/400",
        specialties: [
            { zh: "密室逃脱", en: "Escape Room" },
            { zh: "侦探推理", en: "Detective" },
            { zh: "心理thriller", en: "Psychological Thriller" }
        ],
        scripts: [
            { zh: "深海迷航", en: "Deep Sea Mystery" },
            { zh: "古堡疑云", en: "Castle Shadows" },
            { zh: "暗夜追凶", en: "Night Hunter" }
        ],
        gallery: [
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200"
        ],
        videoUrl: "",
        videoPlaceholder: "/api/placeholder/600/400",
        bio: "彩虹拥有5年带本经验，尤其擅长营造紧张氛围和设计巧妙的推理线索。他的剧本富有层次感，能够让玩家在解谜过程中获得极大的满足感。",
        bioEn: " has 5 years of experience, specializing in creating tense atmospheres and designing clever reasoning clues. His scripts have layers of depth, allowing players to gain great satisfaction during the puzzle-solving process."
    },
    dm2: {
        name: "雪花",
        nameEn: "DM 雪花",
        title: "恐怖剧本专家",
        titleEn: "Horror Script Expert",
        image: "/api/placeholder/400/400",
        specialties: [
            { zh: "恐怖惊悚", en: "Horror & Thriller" },
            { zh: "心理压力", en: "Psychological Pressure" },
            { zh: "沉浸式体验", en: "Immersive Experience" }
        ],
        scripts: [
            { zh: "午夜医院", en: "Midnight Hospital" },
            { zh: "禁忌森林", en: "Forbidden Forest" },
            { zh: "鬼魂旅馆", en: "Ghost Inn" }
        ],
        gallery: [
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200"
        ],
        videoUrl: "",
        videoPlaceholder: "/api/placeholder/600/400",
        bio: "雪花专注于恐怖题材的剧本，善于通过声音、灯光和道具营造恐怖氛围。他的互动式带本风格让玩家能够深度沉浸在故事中，体验惊险刺激的游戏过程。",
        bioEn: " focuses on horror-themed scripts and is good at creating scary atmospheres through sound, lighting, and props. His interactive style allows players to become deeply immersed in the story and experience thrilling gameplay."
    },
    dm3: {
        name: "早早",
        nameEn: "DM 早早",
        title: "奇幻剧本专家",
        titleEn: "Fantasy Script Expert",
        image: "/api/placeholder/400/400",
        specialties: [
            { zh: "奇幻冒险", en: "Fantasy Adventure" },
            { zh: "新手友好", en: "Beginner-friendly" },
            { zh: "团队合作", en: "Team Cooperation" }
        ],
        scripts: [
            { zh: "龙与魔法", en: "Dragons & Magic" },
            { zh: "时间旅人", en: "Time Travelers" },
            { zh: "星际迷途", en: "Lost in Space" }
        ],
        gallery: [
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200"
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
                `<iframe class="dm-video" src="${dm.videoUrl}" allowfullscreen></iframe>` : 
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
}

// 关闭DM弹出卡片
function closeDmPopup() {
    document.getElementById('dmPopupOverlay').style.display = 'none';
    document.getElementById('dmPopup').style.display = 'none';
    
    // 恢复滚动
    document.body.style.overflow = '';
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
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.zIndex = '1100';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.objectFit = 'contain';
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    // 点击关闭
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// 关闭弹出层的键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDmPopup();
    }
});