---
name: DLS 2.0 Bottom Nav
description: Pod-based app navigation - active (64px) / inactive (40px) icons, gradient container, Payments variant
type: reference
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `451:1116`, `1827:655`

Pods: Banking, Explore, Payments, Credit, Activity

## Container (non-Payments)
- Background: gradient transparent → white (stop at 34%)
- Padding: `24px top, 12px bottom`
- Gesture nav: 128x4px bar, rgba(0,0,0,0.3)

## Container (Payments)
- Background: #D30AD7 (brand)
- Padding: 16px top + gesture nav
- Gesture bar: rgba(255,255,255,0.6)

## Active Icon
- Size: 64x64 circle | Background: white | Icon: 32x32
- Shadow: `0px 0px 16px rgba(0,0,0,0.12)` | Radius: 100px

## Inactive Icon
- Size: 40x40 circle | Background: rgba(0,0,0,0.1) | Icon: 24x24
- Gap between icons: 24px | Radius: 100px

## Payments Inactive Icons
- Background: rgba(255,255,255,0.3) | Icon: 20px | Gap: 20px
