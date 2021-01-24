import constants from "./constants.js";
import globals from "./globals.js";
import animationHelper from './animation-helper.js';
import stringUtils from './string-utils.js';
import graphHelper from './graph-helper.js';

import Point from './point.js';

$(document).ready(() => {
    function init() {
        const gridContainer = $('#grid-container');

        let containerW = gridContainer.width();
        let containerH = gridContainer.height();
        globals.setContainerW(containerW);
        globals.setContainerH(containerH);

        let gridLengthX = Math.floor(containerW / constants.GRID_SIZE);
        let gridLengthY = Math.floor(containerH / constants.GRID_SIZE);
        // force odd
        if (gridLengthX % 2 === 0) gridLengthX -= 1;
        if (gridLengthY % 2 === 0) gridLengthY -= 1;
        globals.setGridLengthX(gridLengthX);
        globals.setGridLengthY(gridLengthY);

        let paddingW = (containerW - (gridLengthX * constants.GRID_SIZE)) / 2;
        let paddingH = (containerH - (gridLengthY * constants.GRID_SIZE)) / 2;
        globals.setPaddingW(paddingW);
        globals.setPaddingW(paddingH);

        gridContainer.css({'padding': stringUtils.px(paddingH) + ' ' + stringUtils.px(paddingW)});

        initUiAction();
        initEventAction();
        initGrid();
        initPosition();
    }

    function initUiAction() {
        const dropdown = $('.dropdown');
        dropdown.click(function () {
            $(this).attr('tabindex', 1).focus();
            $(this).toggleClass('active');
            $(this).find('.dropdown-menu').slideToggle(300);
        });
        dropdown.focusout(function () {
            $(this).removeClass('active');
            $(this).find('.dropdown-menu').slideUp(300);
        });
        $('.dropdown .dropdown-menu li').click(function () {
            let spanParent = $(this).parents('.dropdown').find('span');
            spanParent.css('color', '#474747');
            spanParent.text($(this).text());
            $(this).parents('.dropdown').find('input').attr('value', $(this).attr('value'));
        });
    }

    function blockAllAction() {
        globals.setEditingAllowed(false);
        globals.setGenerateMazeAllowed(false);
        globals.setGeneratePathAllowed(false);
        globals.setClearAllowed(false);
    }

    function allowAllAction() {
        globals.setEditingAllowed(true);
        globals.setGenerateMazeAllowed(true);
        globals.setGeneratePathAllowed(true);
        globals.setClearAllowed(true);
    }

    function initEventAction() {
        const shortestPathBoiler = (executable) => {
            if (globals.isGeneratePathAllowed()) {
                blockAllAction();
                clearResult();
                executable().then(result => {
                    if (result.isPathFound) {
                        animationHelper.drawPath(globals.foodPos(), result.prevs).then(_ => allowAllAction());
                    } else {
                        allowAllAction();
                    }
                });
            }
        };

        $('#visualize-btn').click(_ => {
            let algoValue = $('#visualize-algo-input').val();
            switch (parseInt(algoValue)) {
                case constants.ALGO_BFS:
                    shortestPathBoiler(_ => graphHelper.bfs(globals.birdPos(), globals.foodPos()));
                    break;
                case constants.ALGO_DIJKSTRA:
                    shortestPathBoiler(_ => graphHelper.dijkstra(globals.birdPos(), globals.foodPos()));
                    break;
                case constants.ALGO_ASTAR_EUCLIDEAN:
                    shortestPathBoiler(_ => graphHelper.aStar(globals.birdPos(), globals.foodPos()));
                    break;
                case constants.ALGO_ASTAR_MANHATTAN:
                    shortestPathBoiler(_ => graphHelper.aStar(globals.birdPos(), globals.foodPos(), true, graphHelper.manhattanDistance));
                    break;
                default:
                    $('#path-algo-dropdown').find('span').css('color', 'red');
            }
        });

        const mazeBoiler = (executable) => {
            if (globals.isGenerateMazeAllowed()) {
                blockAllAction();
                clearResult();
                executable().then(_ => allowAllAction());
            }
        };

        $('#generate-maze-btn').click(_ => {
            let mazeValue = $('#maze-algo-input').val();
            switch (parseInt(mazeValue)) {
                case constants.MAZE_DFS:
                    mazeBoiler(_ => graphHelper.dfsMaze());
                    break;
                case constants.MAZE_KRUSKAL:
                    mazeBoiler(_ => graphHelper.kruskalMaze());
                    break;
                default:
                    $('#maze-algo-dropdown').find('span').css('color', 'red');
            }
        });

        const clearBoiler = (executable) => {
            if (globals.isClearAllowed()) {
                globals.setEditingAllowed(true);
                globals.setGenerateMazeAllowed(true);
                executable();
            }
        };

        $('#clear-wall-btn').click(_ => clearBoiler(clearWall));
        $('#clear-result-btn').click(_ => clearBoiler(clearResult));
        $('#clear-all-btn').click(_ => clearBoiler(_ => {
            clearWall();
            clearResult();
        }));
    }

    function clearWall() {
        for (let i = 0; i < globals.gridLengthY(); i++) {
            for (let j = 0; j < globals.gridLengthX(); j++) {
                animationHelper.removeClassFromPoint(new Point(j, i), constants.CLASS_WALL);
            }
        }
    }

    function clearResult() {
        for (let i = 0; i < globals.gridLengthY(); i++) {
            for (let j = 0; j < globals.gridLengthX(); j++) {
                animationHelper.removeClassesFromPoint(new Point(j, i), constants.CLASS_VISITED, constants.CLASS_PATH);
            }
        }
    }

    function initGrid() {
        let gridTable = $('#grid-table');
        gridTable.html('');

        for (let i = 0; i < globals.gridLengthY(); i++) {
            let row = $(`<tr></tr>`);
            for (let j = 0; j < globals.gridLengthX(); j++) {
                let col = $(`<td id="${i}-${j}"></td>`);
                col.mousedown(async e => {
                    globals.setWallCreatorMode(true);
                    if (globals.isEditingAllowed()) {
                        toggleWallIfValid(e.target.id);
                    }
                });
                col.mouseup(_ => {
                    globals.setWallCreatorMode(false);
                });
                col.mouseenter(async e => {
                    if (globals.isEditingAllowed() && globals.isWallCreatorMode()) {
                        toggleWallIfValid(e.target.id);
                    }
                });
                row.append(col);
            }
            gridTable.append(row);
        }
    }

    function toggleWallIfValid(targetId) {
        let targetPosition = new Point(parseInt(targetId.split('-')[1]), parseInt(targetId.split('-')[0]));

        let isBirdPosition = globals.birdPos().x === targetPosition.x && globals.birdPos().y === targetPosition.y;
        let isFoodPosition = globals.foodPos().x === targetPosition.x && globals.foodPos().y === targetPosition.y;
        if (!isBirdPosition && !isFoodPosition) {
            animationHelper.toggleClassAtId(targetId, constants.CLASS_WALL);
        }
    }

    function initPosition() {
        let birdPosX = Math.floor(globals.gridLengthX() / 4);
        if (birdPosX % 2 === 0) birdPosX += 1;
        let birdPosY = Math.floor(globals.gridLengthY() / 2);
        if (birdPosY % 2 === 0) birdPosY += 1;
        let birdPos = new Point(birdPosX, birdPosY);
        globals.setBirdPos(birdPos);
        animationHelper.addClassToPoint(birdPos, constants.CLASS_BIRD);

        let foodPosX = Math.floor(globals.gridLengthX() * 3 / 4);
        if (foodPosX % 2 === 0) foodPosX -= 1;
        let foodPosY = Math.floor(globals.gridLengthY() / 2);
        if (foodPosY % 2 === 0) foodPosY += 1;
        let foodPos = new Point(foodPosX, foodPosY);
        globals.setFoodPos(foodPos);
        animationHelper.addClassToPoint(foodPos, constants.CLASS_FOOD);
    }

    init();
});
