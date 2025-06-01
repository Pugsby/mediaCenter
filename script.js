var audioEnabled = false;
var menu = "home";
var mediaTypeList = document.getElementById("mediaTypeList");
var selected = 1;
async function loadPlugin (blob, name) {
    var zip = await JSZip.loadAsync(blob);
    console.log("Plugin contents:");
    Object.keys(zip.files).forEach(filename => {
        console.log(filename);
    });
    var styleCssFile = zip.file('style.css');
    if (styleCssFile) {
        const styleCssContent = await styleCssFile.async('text');
        const styleElement = document.createElement('style');
        styleElement.textContent = styleCssContent;
        document.head.appendChild(styleElement);
    }
    var iconPngFile = zip.file('icon.png');
    if (iconPngFile) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(await iconPngFile.async('blob'));
        img.style.width = '100%';
        img.title = name;
        mediaTypeList.appendChild(img);
    }
    var initJsFile = zip.file('init.js');
    if (initJsFile) {
        const initJsContent = await initJsFile.async('text');
        const blobUrl = URL.createObjectURL(new Blob([initJsContent], { type: 'text/javascript' }));
        await import(blobUrl);
        URL.revokeObjectURL(blobUrl);
    } else {
        console.warn("init.js not found in plugin.");
    }
    var scriptJsFile = zip.file('script.js');
    if (scriptJsFile) {
        const scriptJsContent = await scriptJsFile.async('text');
        const blobUrl = URL.createObjectURL(new Blob([scriptJsContent], { type: 'text/javascript' }));
        await import(blobUrl);
        URL.revokeObjectURL(blobUrl);
    } else {
        console.warn("script.js not found in plugin.");
    }
    
}
async function loadPluginFromPath(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to fetch plugin: ${response.statusText}`);
        }
        const blob = await response.blob();
        const name = path.split('/').pop().replace(/\.[^/.]+$/, "");
        await loadPlugin(blob, name);
    } catch (err) {
        console.error("Error loading plugin from path:", err);
    }
}
async function loadPluginFromFolder(path) {
    try {
        // List of expected plugin files
        const files = ['icon.png', 'init.js', 'script.js', 'style.css'];
        const zip = new JSZip();

        for (const fileName of files) {
            const fileResp = await fetch(`${path}/${fileName}`);
            if (fileResp.ok) {
            const fileData = await fileResp.arrayBuffer();
            zip.file(fileName, fileData);
            } else {
            // Not all files are required, so just warn if missing
            console.warn(`Could not fetch ${fileName}: ${fileResp.statusText}`);
            }
        }

        // Generate the zip blob and load as plugin
        const blob = await zip.generateAsync({ type: 'blob' });
        const name = path.split('/').pop();
        await loadPlugin(blob, name);
    } catch (err) {
        console.error("Error loading plugin from folder:", err);
    }
}
// Sequentially load plugins: wait for each to finish before loading the next
(async () => {
    await loadPluginFromPath('initialPlugins/Videos.pmcp');
    await loadPluginFromPath('initialPlugins/Games.pmcp');
    await loadPluginFromPath('initialPlugins/Plugin Manager.pmcp');
})();


function centerSelectedItem() {
    const itemHeight = 74;
    const windowHeight = window.innerHeight;
    const offset = (windowHeight / 2) - (itemHeight / 2) - (selected * itemHeight);
    mediaTypeList.style.transform = `translateY(${offset - 15}px)`;
}
if (window.location.search.includes('reloaded=true')) {
    audioEnabled = true
} else {
    const audioBlock = document.getElementById('audioBlock');
    audioEnabled = false;
    if (audioBlock) {
        audioBlock.style.display = 'block';
    }
}
function select(s) {
    if (menu == "home") {
        selected = s;
        const audio = new Audio('sfx/select.wav');
        if (audioEnabled) {
            audio.play();
        }
        Array.from(mediaTypeList.children).forEach((item, idx) => {
            item.classList.toggle('selected', idx === selected);
        });
        centerSelectedItem();
        if (mediaTypeList.children[selected]) {
            document.getElementById("selectedText").innerText = mediaTypeList.children[selected].title;
        }
    }
}

function scrollMediaTypeList(delta) {
    const itemCount = mediaTypeList.children.length;
    if (delta > 0 && selected < itemCount - 1) {
        select(selected + 1);
    } else if (delta < 0 && selected > 0) {
        select(selected - 1);
    }
}


setTimeout(() => select(0), 100);
window.addEventListener('resize', centerSelectedItem);

document.addEventListener('keydown', (e) => {
    if (menu == "home") {
        if (e.key === 'ArrowDown') {
            scrollMediaTypeList(1);
        } else if (e.key === 'ArrowUp') {
            scrollMediaTypeList(-1);
        }
    }
});

document.addEventListener('click', () => {
    if (!audioEnabled) {
        const audioBlock = document.getElementById('audioBlock');
        if (audioBlock) {
            audioBlock.style.display = 'none';
            audioEnabled = true;
        }
    } else {
        if (menu == "home") {
            mediaTypeList.style.left = '-160px';
            if (audioEnabled) {
                const clickAudio = new Audio('sfx/click.wav');
                clickAudio.play();
            }
            document.getElementById("selectedText").style.opacity = 0;
            setTimeout(() => {
                const selectedText = document.getElementById("selectedText").innerText;
                const lower = selectedText
                    .toLowerCase()
                    .replace(/ (.)/g, (_, c) => c.toUpperCase())
                    .replace(/ /g, '');
                menu = lower;
                document.getElementById(lower).style.display = "block";
            }, 100);
        }
    }
});



document.addEventListener('wheel', (e) => {
    if (menu == "home") {
        e.preventDefault();
        scrollMediaTypeList(e.deltaY);
    }
}, { passive: false });

function leaveMenu () {
    window.location = "index.html?reloaded=true";
}

