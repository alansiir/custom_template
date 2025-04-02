// menuItems-data.ts

export interface MenuItem {
  label: string;
  icon: string;
}

export const menuItems: MenuItem[] = [
  { label: 'Template', icon: 'mdi:layers-outline' },
  { label: 'Shape', icon: 'mdi:shape' },
  { label: 'Text', icon: 'mdi:format-text' },
  { label: 'Image', icon: 'mdi:image-outline' },
  { label: 'Icon', icon: 'mdi:emoticon-outline' },
  { label: 'Button', icon: 'mdi:gesture-tap-button' },
  { label: 'Form', icon: 'mdi:form-select' },
];
