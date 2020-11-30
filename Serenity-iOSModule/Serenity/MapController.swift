//
//  MapController.swift
//  Serenity
//
//  Created by Anant Patni on 11/29/20.
//

import UIKit
import WebKit

class MapController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        webView = WKWebView()
        webView.navigationDelegate = self
        view = webView
    }
    
    //Comment
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = URL(string: "https://www.google.com/maps/search/?api=1&query=pizza")!
        webView.load(URLRequest(url: url))
        webView.allowsBackForwardNavigationGestures = true
    }
}
