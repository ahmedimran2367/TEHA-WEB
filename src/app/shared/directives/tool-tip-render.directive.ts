import { Directive, Input, TemplateRef, ElementRef, HostListener, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { CustomToolTipComponent } from '../components/custom-tool-tip/custom-tool-tip.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[customToolTip]'
})

export class ToolTipRenderDirective implements OnInit, OnDestroy {

  @Input() showToolTip = true;
  @Input() originX: 'start' | 'center' | 'end' = 'end';
  @Input() offsetX = 10;

  // If this is specified then specified text will be showin in the tooltip
  @Input(`customToolTip`) text: string;

  // If this is specified then specified template will be rendered in the tooltip
  @Input() contentTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;
  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef) { }

  /**
   * Init life cycle event handler
   */
  ngOnInit(): void {

    if (!this.showToolTip) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
                                 .flexibleConnectedTo(this.elementRef)
                                 .withPositions([{
                                                    originX: this.originX,
                                                    originY: 'center',
                                                    overlayX: 'start',
                                                    overlayY: 'center',
                                                    offsetX: this.offsetX,
                                                }]);

    this.overlayRef = this.overlay.create({ positionStrategy});

  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  show(): any {
    // attach the component if it has not already attached to the overlay
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<CustomToolTipComponent> = this.overlayRef.attach(new ComponentPortal(CustomToolTipComponent));
      tooltipRef.instance.text = this.text;
      tooltipRef.instance.contentTemplate = this.contentTemplate;
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  hide(): void {
    this.closeToolTip();
  }

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy(): void {
    this.closeToolTip();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  private closeToolTip(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

}
