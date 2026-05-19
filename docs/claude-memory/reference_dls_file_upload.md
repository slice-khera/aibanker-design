---
name: DLS 2.0 File Upload
description: Upload component - 4 states (Default, Loading, Image, PDF), dashed border container
type: reference
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `727:1496`, `1910:20442`

## Container
- 136×80px | Border: 1px dashed rgba(0,0,0,0.2) | Radius: 16px | Padding: 16px | Gap: 8px

## Typography
- Label: Caption - 12px regular, 16px lh, 0.24px tracking, rgba(0,0,0,0.5)
- PDF filename: same but rgba(0,0,0,0.7)

## States

### Default
- `Status/Upload circle` icon (24×24) centered + "Upload" label below

### Loading
- Dot loader animation (pulse valentino) centered, 40×20px in pill
- No label

### Image
- Thumbnail fills container (112×56px)
- Close button: top-right, offset -8.5px, 20×20px circle, bg #f6f9fc, `Interface/Cross` 12×12px

### PDF
- Inner card: bg #f6f9fc, rounded 8px, padding 4px
- `Documents/File signed` icon (24×24) + filename (ellipsis)
- Close button: same as Image state

## Multi-Upload
Multiple containers side by side, each independent state.
