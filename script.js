document.addEventListener('DOMContentLoaded', () => {
    const showSvgBtn = document.getElementById('show-svg');
    const showSymbolsBtn = document.getElementById('show-symbols');
    const svgIconsSection = document.getElementById('svg-icons-section');
    const specialSymbolsSection = document.getElementById('special-symbols-section');
    const svgIconsGrid = document.getElementById('svg-icons-grid');
    const specialSymbolsGrid = document.getElementById('special-symbols-grid');
    const copySuccessPopup = document.getElementById('copy-success-popup');

    // 切换显示 SVG 或特殊符号
    function switchSection(targetSection) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        targetSection.classList.add('active');

        document.querySelectorAll('.sidebar ul li a').forEach(link => {
            link.classList.remove('active');
        });
        if (targetSection === svgIconsSection) {
            showSvgBtn.classList.add('active');
        } else {
            showSymbolsBtn.classList.add('active');
        }
    }

    showSvgBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchSection(svgIconsSection);
    });

    showSymbolsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchSection(specialSymbolsSection);
    });

    // 复制到剪贴板功能
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showPopup();
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制。');
        }
    }

    // 显示复制成功弹窗
    function showPopup() {
        copySuccessPopup.classList.add('show');
        setTimeout(() => {
            copySuccessPopup.classList.remove('show');
        }, 1500);
    }

    // 加载 SVG 图标
    async function loadSvgIcons() {
        const svgFiles = await fetch('svg-list.json').then(res => res.json()); // 假设有一个文件列表
        // 实际上，你需要一个服务器端脚本或手动维护 svg-list.json 文件
        // 在 GitHub Pages 纯前端环境下，自动遍历目录比较困难。
        // 一个简单的实现方式是预先生成一个 svg-list.json
        // 或者使用像 https://github.com/thg-consulting/github-directory-listing-action 这样的 GitHub Action 来生成文件列表

        for (const filename of svgFiles) {
            try {
                const response = await fetch(`svg/${filename}`);
                const svgCode = await response.text();
                const iconName = filename.replace('.svg', '');

                const card = document.createElement('div');
                card.classList.add('item-card');
                card.innerHTML = `
                    ${svgCode}
                    <span class="icon-name">${iconName}</span>
                    <button class="copy-btn">复制</button>
                `;
                card.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(svgCode));
                svgIconsGrid.appendChild(card);
            } catch (error) {
                console.error(`加载 SVG 文件失败: ${filename}`, error);
            }
        }
    }

    // 加载特殊符号
    async function loadSpecialSymbols() {
        try {
            const response = await fetch('data/special-symbols.json');
            const categories = await response.json();

            for (const categoryName in categories) {
                const categorySymbols = categories[categoryName];

                const categoryTitle = document.createElement('h2');
                categoryTitle.classList.add('category-title');
                categoryTitle.textContent = categoryName;
                specialSymbolsGrid.appendChild(categoryTitle);

                for (const symbolItem of categorySymbols) {
                    const card = document.createElement('div');
                    card.classList.add('item-card');
                    card.innerHTML = `
                        <span class="symbol-char">${symbolItem.char}</span>
                        <span class="symbol-name">${symbolItem.name}</span>
                        <button class="copy-btn">复制</button>
                    `;
                    card.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(symbolItem.char));
                    specialSymbolsGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('加载特殊符号失败:', error);
        }
    }

    // 初始化加载
    loadSvgIcons();
    loadSpecialSymbols();
    switchSection(svgIconsSection); // 默认显示 SVG 图标库
});
