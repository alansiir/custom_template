import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

interface DesignElement {
  id: string;
  type: 'navbar' | 'sidebar' | 'rectangle';
  node: Konva.Group | Konva.Rect;
}

@Component({
  selector: 'app-konva-test',
  templateUrl: './konva-test.component.html',
  styleUrls: ['./konva-test.component.css']
})
export class KonvaTestComponent implements OnInit {
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private dropzone!: Konva.Rect;
  private transformer!: Konva.Transformer;
  private elements: DesignElement[] = [];
  private selectedElement: DesignElement | null = null;

  ngOnInit(): void {
    this.initializeStage();
    this.createDropzone();
    this.createTransformer();
    this.createDefaultElements();
    this.setupEventHandlers();
  }

  private initializeStage(): void {
    this.stage = new Konva.Stage({
      container: 'konva-container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  private createDropzone(): void {
    const dropzoneSize = 500;
    this.dropzone = new Konva.Rect({
      x: (this.stage.width() - dropzoneSize) / 2,
      y: (this.stage.height() - dropzoneSize) / 2,
      width: dropzoneSize,
      height: dropzoneSize,
      stroke: 'gray',
      strokeWidth: 2,
      dash: [5, 5],
      name: 'dropzone'
    });
    this.layer.add(this.dropzone);
  }

  private createTransformer(): void {
    this.transformer = new Konva.Transformer({
      nodes: [],
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }

        // Limit resizing to stay within dropzone
        const maxWidth = this.dropzone.x() + this.dropzone.width() - newBox.x;
        const maxHeight = this.dropzone.y() + this.dropzone.height() - newBox.y;
        
        newBox.width = Math.min(newBox.width, maxWidth);
        newBox.height = Math.min(newBox.height, maxHeight);
        
        return newBox;
      }
    });
    this.layer.add(this.transformer);
  }

  private getDragBoundFunc(width: number, height: number): (pos: { x: number; y: number }) => { x: number; y: number } {
    return (pos) => ({
      x: Math.max(this.dropzone.x(), Math.min(pos.x, this.dropzone.x() + this.dropzone.width() - width)),
      y: Math.max(this.dropzone.y(), Math.min(pos.y, this.dropzone.y() + this.dropzone.height() - height))
    });
  }

  private createDefaultElements(): void {
    // Create and add navbar
    const navbar = this.createNavbar();
    this.elements.push({
      id: 'navbar-' + Date.now(),
      type: 'navbar',
      node: navbar
    });
    this.layer.add(navbar);

    // Create and add sidebar
    const sidebar = this.createSidebar();
    this.elements.push({
      id: 'sidebar-' + Date.now(),
      type: 'sidebar',
      node: sidebar
    });
    this.layer.add(sidebar);

    // Create and add rectangle
    const rectangle = this.createRectangle();
    this.elements.push({
      id: 'rect-' + Date.now(),
      type: 'rectangle',
      node: rectangle
    });
    this.layer.add(rectangle);

    this.layer.draw();
  }

  private createNavbar(): Konva.Group {
    const navbarBg = new Konva.Rect({
      width: 400,
      height: 50,
      fill: '#2c3e50',
      cornerRadius: 5
    });

    const safranText = new Konva.Text({
      x: 20,
      y: 15,
      text: 'SAFRAN',
      fontSize: 18,
      fontFamily: 'Arial',
      fill: 'white',
      fontStyle: 'bold'
    });

    const menuItems = ['Services', 'Projects', 'Profile'];
    const menuGroup = new Konva.Group({ x: 150, y: 15 });

    menuItems.forEach(item => {
      const text = new Konva.Text({
        x: menuGroup.children.length * 100,
        text: item,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: 'white',
        padding: 10
      });
      menuGroup.add(text);
    });

    const navbarGroup = new Konva.Group({
      x: this.dropzone.x() + 20,
      y: this.dropzone.y() + 20,
      draggable: true,
      name: 'navbar',
      dragBoundFunc: this.getDragBoundFunc(400, 50)
    });

    navbarGroup.add(navbarBg);
    navbarGroup.add(safranText);
    navbarGroup.add(menuGroup);

    return navbarGroup;
  }

  private createSidebar(): Konva.Group {
    const sidebarBg = new Konva.Rect({
      width: 104,
      height: 352,
      fill: '#183149',
      cornerRadius: 5
    });

    const menuItems = ['Home', 'Dashboard', 'Settings'];
    const menuGroup = new Konva.Group({ x: 20, y: 20 });

    menuItems.forEach((item, index) => {
      const text = new Konva.Text({
        y: index * 40,
        text: item,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: 'white',
        padding: 10
      });
      menuGroup.add(text);
    });

    const sidebarGroup = new Konva.Group({
      x: this.dropzone.x() + 20,
      y: this.dropzone.y() + 100,
      draggable: true,
      name: 'sidebar',
      dragBoundFunc: this.getDragBoundFunc(104, 352)
    });

    sidebarGroup.add(sidebarBg);
    sidebarGroup.add(menuGroup);

    return sidebarGroup;
  }

  private createRectangle(): Konva.Rect {
    return new Konva.Rect({
      x: this.dropzone.x() + this.dropzone.width() / 2 - 50,
      y: this.dropzone.y() + this.dropzone.height() / 2 - 50,
      width: 100,
      height: 100,
      fill: 'red',
      draggable: true,
      name: 'rectangle',
      dragBoundFunc: this.getDragBoundFunc(100, 100)
    });
  }

  private setupEventHandlers(): void {
    // Handle element selection
    this.stage.on('click tap', (e) => {
      if (e.target === this.stage || e.target === this.dropzone) {
        this.deselectAll();
        return;
      }

      const clickedElement = this.findElementFromTarget(e.target);
      if (clickedElement) {
        this.selectElement(clickedElement);
      }
    });

    // Handle drag end to update element position
    this.stage.on('dragend', (e) => {
      const draggedElement = this.findElementFromTarget(e.target);
      if (draggedElement) {
        console.log(`${draggedElement.type} moved to:`, e.target.position());
      }
    });
  }

  private findElementFromTarget(target: Konva.Node): DesignElement | null {
    // If target is a child element (like text), find its parent group
    const actualNode = target instanceof Konva.Text ? target.parent?.parent : target;
    
    if (!actualNode) return null;
    
    return this.elements.find(el => el.node === actualNode) || null;
  }

  private selectElement(element: DesignElement): void {
    this.deselectAll();
    this.selectedElement = element;
    this.transformer.nodes([element.node]);
    this.layer.draw();
  }

  private deselectAll(): void {
    this.selectedElement = null;
    this.transformer.nodes([]);
    this.layer.draw();
  }

  // Public method to add new elements if needed
  public addElement(type: 'navbar' | 'sidebar' | 'rectangle'): void {
    let newElement: Konva.Group | Konva.Rect;
    
    switch (type) {
      case 'navbar':
        newElement = this.createNavbar();
        break;
      case 'sidebar':
        newElement = this.createSidebar();
        break;
      case 'rectangle':
        newElement = this.createRectangle();
        break;
    }

    const elementData: DesignElement = {
      id: `${type}-${Date.now()}`,
      type,
      node: newElement
    };

    this.elements.push(elementData);
    this.layer.add(newElement);
    this.selectElement(elementData);
    this.layer.draw();
  }
}