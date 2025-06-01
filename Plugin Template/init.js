var pluginTemplateDiv = document.createElement('div');
pluginTemplateDiv.id = 'pluginTemplate';
pluginTemplateDiv.style.display = 'none';
document.body.appendChild(pluginTemplateDiv);
var backButton = document.createElement('img');
backButton.id = 'pluginTemplateHome';
backButton.src = 'icons/back.png';
backButton.addEventListener('click', leaveMenu);
pluginTemplateDiv.appendChild(backButton);