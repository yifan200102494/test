document.addEventListener('DOMContentLoaded', function() {
    // 创建弹出层元素
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'image-popup-overlay';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'image-popup';
    
    const popupImage = document.createElement('img');
    popupContainer.appendChild(popupImage);
    
    const closeButton = document.createElement('div');
    closeButton.className = 'image-popup-close';
    closeButton.innerHTML = '×';
    
    popupOverlay.appendChild(popupContainer);
    popupOverlay.appendChild(closeButton);
    document.body.appendChild(popupOverlay);
    
    // 为所有图片添加点击事件
    document.querySelectorAll('img').forEach(img => {
        // 排除已经在弹出层中的图片
        if (!img.closest('.image-popup')) {
            img.setAttribute('data-popup', 'true');
            img.addEventListener('click', function(e) {
                e.preventDefault();
                popupImage.src = this.src;
                popupOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    // 关闭弹出层
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    closeButton.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    // 添加键盘事件支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.style.display === 'block') {
            closePopup();
        }
    });
}); 