// global elements
let menu = document.querySelector('header > .header-toggle');

// functions
function typer(i, t, ie, oe) {
  oe.innerText += ie.charAt(i);
  setTimeout(function() {
    ((i < ie.length - 1) ? typer(i+1, t, ie, oe) : false);
  }, t);
}

function runTyper (instant, delay) {
  document.querySelectorAll('[data-typer]').forEach(function (element) {
    let input = element.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    let dataValue = element.getAttribute('data-typer');
    let dataOutput = document.querySelector(`[data-typer-output="${dataValue}"]`);
    let dataDelay = delay != null ? delay : element.getAttribute('data-typer-delay');

    if (instant) {
      dataOutput.innerText = input;
    } else {
      setTimeout(function() {
        typer(0, 100, input, dataOutput);
      }, dataDelay);
    }
  });
}

function handleHash (e) {
  location.hash = e;
  
  let activeClicks = document.querySelectorAll('a.active');
  activeClicks.forEach(click => {
    click.classList.remove('active');
  });

  let activeSections = document.querySelectorAll('section.active');
  activeSections.forEach(section => {
    section.classList.remove('active');
  });

  document.querySelector(`[onclick="handleHash('${e}')"]`).classList.add('active');
  document.getElementById(e).classList.add('active');

  if (window.innerWidth < 800) {
    menu.classList.remove('active');
  }
}

function handleMenu () {
  menu.classList.toggle('active');
}

if (location.hash) {
  runTyper(true, 0);

  let activeHash = location.hash.replace('#', '')
  document.querySelector('body').classList.add('loaded');
  document.querySelector(`[onclick="handleHash('${activeHash}')"]`).classList.add('active');
  document.getElementById(activeHash).classList.add('active');
} else {
  runTyper();
  menu.classList.add('active');
}