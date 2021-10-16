import $ from 'jquery';

const updatePosition = (tooltipId, event) => {
  const yOffset = 20;
  const xOffset = 30;
  const ttid = `#${tooltipId}`;

  const ttw = $(ttid).width();
  const tth = $(ttid).height();

  const wscrY = $(window).scrollTop();
  const wscrX = $(window).scrollLeft();

  const curX = (document.all) ? event.clientX + wscrX : event.pageX;
  const curY = (document.all) ? event.clientY + wscrY : event.pageY;
  let ttleft = ((curX - wscrX + xOffset * 2 + ttw) > $(window).width()) ? curX - ttw - xOffset * 2 : curX + xOffset;

  if (ttleft < (wscrX + xOffset)) {
    ttleft = wscrX + xOffset;
  }

  let tttop = ((curY - wscrY + yOffset * 2 + tth) > $(window).height()) ? curY - tth - yOffset * 2 : curY + yOffset;
  if (tttop < wscrY + yOffset) {
    tttop = curY + yOffset;
  }

  $(ttid).css('top', `${tttop}px`).css('left', `${ttleft}px`);
};

const hideTooltip = (tooltipId) => {
  $(`#${tooltipId}`).hide();
};

const showTooltip = (content, toolTipId, event) => {
  $(`#${toolTipId}`).html(content);
  $(`#${toolTipId}`).show();

  updatePosition(event);
};

export default function CustomTooltip(toolTipId, width) {
  // If tooltip is already present do new one gets appended (In one page webapp remains present)
  if ($(`#${toolTipId}`).length < 1) {
    $('body').append(`<div class='tooltip' id='${toolTipId}'></div>`);
  }

  if (width) {
    $(`#${toolTipId}`).css('width', width);
  }

  hideTooltip();

  return {
    showTooltip,
    hideTooltip,
    updatePosition
  };
}
