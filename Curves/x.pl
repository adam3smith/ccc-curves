# perluse strict;my @ar = qw(archimedean_spiralastroidcardioidcassinian_ovalcatenarycirclecissoidclothoidconchoidconicscubiccycloiddeltoidellipsefolium_of_descartehyperbolahypotrochoidimplicitlemniscatelimaconlissajouslog_spiralnephroidnephroid_of_freethparabolasinetacnodal_quartictractrix);# $rpath='/Users/xah/Documents/3dxm/web/Curves';use Data::Dumper;for my $core (@ar) {    my $title=join(' ' ,map {ucfirst($_)} ( split('_', $core) ) );    my $filepath = "$core/$core.html";    my $current_dir = "$core/";    opendir(DIR, $current_dir);    my @dir_files = readdir(DIR);    closedir DIR;    my @pdf_files = grep { $_ =~ m/\.pdf$|\.mov$/ } @dir_files;    my $pdf_links ='';    for my $fname (@pdf_files) {        $pdf_links .= qq(<p><a href="$fname">$fname</a></p>\n);        }my $bodytext= <<"ddhh";<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html><head><META HTTP-EQUIV="Content-Type" CONTENT="text/html;charset=utf-8"><link rel="StyleSheet" href="../curve.css" type="text/css"><title>3D-XplorMath Plane Curve Gallery</title></head><body><pre class="nav">Back to <a href="../index.html">3D-XplorMath Plane Curve Gallery</a></pre><h1>$title</h1><img src="$core.png" alt="$title"><p>$title</p>$pdf_links<hr><pre class="nav">Back to <a href="../index.html">3D-XplorMath Plane Curve Gallery</a></pre><pre class="footer">http://vmm.math.uci.edu/3D-XplorMath/Curve/gallery.html© Copyright 2004-2006 3DXM Consortium.Please send comments or suggestions to <a href="mailto:palais%40uci.edu">palais&#64;uci.edu</a></pre></body></html>ddhh#print $bodytext, "\n";#print $filepath, "\n";open (TT, ">$filepath") or die "fucked $!";print TT $bodytext;close(TT);#   print qq(<a href="$filepath">$title</a>), "\n";}__END__