import 'package:flutter_test/flutter_test.dart';
import 'package:agrohub_express_mobile/main.dart';

void main() {

  testWidgets(

    'App loads successfully',

    (WidgetTester tester) async {

      await tester.pumpWidget(

        const AgroHubExpressApp(),
      );

      expect(
        find.byType(
          AgroHubExpressApp,
        ),
        findsOneWidget,
      );
    },
  );
}